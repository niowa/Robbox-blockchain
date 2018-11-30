module.exports = function(accounts) {
    return {
        addminAddress: accounts[0],
        options: {
            gasPrice: 10*1000000000,
            from: accounts[0],
        },
    };
}
