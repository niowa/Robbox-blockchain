pragma solidity 0.4.24;

import "./Ownable.sol";


contract FilesStore is Ownable {

  struct FileParts {
    uint part;
    string data;
  }

  struct File {
    string name;
    string format;
    bool isExist;
    mapping(bytes32 => FileParts[]) file;
  }

  address public adminAddress;
  mapping(string => File) private files;

  event SaveFile(string id, string name, string format);
  event SaveFileVersion(string id, bytes32 version);

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
  /// @param _id file unique id
  /// @param _name item price
  /// @param _format item price
  /// @param _data item price
  function addFile(string _id, string _name, string _format, uint _part, string _data) public onlyOwner {
    bytes32 version = "0.0.1";
    if (!files[_id].isExist) {
      files[_id] = File(_name, _format, true);
      emit SaveFile(_id, _name, _format);
      emit SaveFileVersion(_id, version);
    }

    files[_id].file[version].push(FileParts(_part, _data));
  }

  /// @notice Add new version of file
  /// @param _id file unique id
  /// @param _version item price
  /// @param _data item price
  function addFileVersion(string _id, bytes32 _version, uint _part, string _data) public onlyOwner {
    require(files[_id].isExist);
    if (files[_id].file[_version].length == 0) {
      emit SaveFileVersion(_id, _version);
    }

    files[_id].file[_version].push(FileParts(_part, _data)); // move to separate func
  }

  /// @notice Get part of file
  /// @param _id item description
  /// @param _version item price
  /// @return data  new item Id
  function getFilePart(string _id, bytes32 _version, uint _index) public onlyOwner returns (uint part, string data) {
    return (files[_id].file[_version][_index].part, files[_id].file[_version][_index].data);
  }

  /// @notice Get info about file
  /// @param _id item description
  /// @return data  new item Id
  function getFileInfo(string _id) public onlyOwner returns (string name, string format) {
    return (files[_id].name, files[_id].format);
  }

  /// @notice Get amount of parts selected file
  /// @param _id item description
  /// @param _version item price
  /// @return data  new item Id
  function getFileSize(string _id, bytes32 _version) public onlyOwner returns (uint fileSize) {
    return files[_id].file[_version].length;
  }
}
