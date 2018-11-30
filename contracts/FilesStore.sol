pragma solidity 0.4.24;

import "./Ownable.sol";


/// @title Ownable contract which allows to store data for permissioned address
contract FilesStore is Ownable {

  struct FileParts {
    uint part;
    string data;
  }

  struct File {
    string name;
    string format;
    bool isExist;
    mapping(string => FileParts[]) file;
  }

  address public adminAddress;
  mapping(string => File) private files;

  event SaveFile(string id, string name, string format, string versions);

  constructor() public {
    owner = msg.sender;
  }

  /// @notice Set address which allowed to add items
  /// @param _allowedAddress address allowed to insert new items
  function setAdminAddress(address _allowedAddress) external onlyOwner {
    require(_allowedAddress != address(0), "Allowed address cannot be null");
    adminAddress = _allowedAddress;
  }

  /// @notice Add file to collection
  /// @param _id item description
  /// @param _version item price
  /// @param _name item price
  /// @param _format item price
  /// @param _data item price
  /// @return _itemId  new item Id
  function addFile(string _id, string _version, string _name, string _format, uint _part, string _data) public onlyOwner {
    if (!files[_id].isExist) {
      emit SaveFile(_id, _name, _format, _version);
    }
    files[_id] = File(_name, _format, true);
    files[_id].file[_version].push(FileParts(_part, _data));
  }

  /// @notice Get file
  /// @param _id item description
  /// @param _version item price
  /// @return data  new item Id
  function getFile(string _id, string _version, uint _index) public onlyOwner returns (uint part, string data) {
    return (files[_id].file[_version][_index].part, files[_id].file[_version][_index].data);
  }

  /// @notice Get amount of parts selected file
  /// @param _id item description
  /// @param _version item price
  /// @return data  new item Id
  function getFileSize(string _id, string _version) public onlyOwner returns (uint fileSize) {
    return files[_id].file[_version].length;
  }
}
