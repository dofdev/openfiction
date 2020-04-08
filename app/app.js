// The object 'Contracts' will be injected here, which contains all data for all contracts, keyed on contract name:
// Contracts['MyContract'] = {
//  abi: [],
//  address: "0x..",
//  endpoint: "http://...."
// }

function Monolith(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

Monolith.prototype.init = function () {
    // We create a new Web3 instance using either the Metamask provider
    // or an independent provider created towards the endpoint configured for the contract.
    this.web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
        new Web3.providers.HttpProvider(this.Contract.endpoint));

    // Create the contract interface using the ABI provided in the configuration.
    var contract_interface = this.web3.eth.contract(this.Contract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    this.instance = contract_interface.at(this.Contract.address);
}

// Publish
Monolith.prototype.publish = function () {
    var that = this;
    // $("#button-publish").attr("disabled", true);
    // $("#text-content").attr("disabled", true);
    showStatus("requesting");
    // this.instance._content = $("#text-content").val();
    // console.log(this.instance._content);

    var content = $("#text-content").val();

    this.instance.publish(window.web3.eth.accounts[0],
        content,
        { from: window.web3.eth.accounts[0], gas: 100000, gasPrice: 100000, gasLimit: 100000 },
        function (error, txHash) {
            if (error) {
                console.log(error);
                showStatus("error");
            }
            // If success then wait for confirmation of transaction
            // with utility function and clear form values while waiting
            else {
                that.waitForReceipt(txHash, function (receipt) {
                    if (receipt.status) {
                        $("#text-content").val("");
                        showStatus("published");
                    }
                    else {
                        console.log("error");
                    }
                });
            }
        }
    );
}

// Turn page?
Monolith.prototype.turn = function (by) {
    var that = this;

    showStatus("turning");

    this.instance.turn(window.web3.eth.accounts[0], by,
        { from: window.web3.eth.accounts[0], gas: 100000, gasPrice: 100000, gasLimit: 100000 },
        function (error, txHash) {
            if (error) {
                console.log(error);
                showStatus("error");
            }
            // If success then wait for confirmation of transaction
            // with utility function and clear form values while waiting
            else {
                that.waitForReceipt(txHash, function (receipt) {
                    if (receipt.status) {
                        $("#text-content").val("");
                        showStatus("turned");

                        that.read();
                    }
                    else {
                        console.log("error");
                    }
                });
            }
        }
    );
}

Monolith.prototype.bookmarkPlace = function () {
    var that = this;
    
    showStatus("requesting");

    this.instance.bookmarkPlace(window.web3.eth.accounts[0], function (error, result) {
        if (error) {
            console.log(error);
            showStatus("error");
        }
        else {
            console.log(result);
            showStatus("" + result.toNumber());
        }
    });
}

Monolith.prototype.read = function () {
    var that = this;

    showStatus("requesting");

    this.instance.read(window.web3.eth.accounts[0], function (error, result) {
        if (error) {
            console.log(error);
            showStatus("error");
        }
        else {
            $("#text-content").val(result.toString());

            console.log(result);
            showStatus("success");

            that.bookmarkPlace();
        }
    });
}

// Waits for receipt of transaction
Monolith.prototype.waitForReceipt = function (hash, cb) {
    var that = this;

    // Checks for transaction receipt using web3 library method
    this.web3.eth.getTransactionReceipt(hash, function (err, receipt) {
        if (err) {
            error(err);
        }
        if (receipt !== null) {
            // Transaction went through
            if (cb) {
                cb(receipt);
            }
        } else {
            // Try again in 2 second
            window.setTimeout(function () {
                that.waitForReceipt(hash, cb);
            }, 2000);
        }
    });
}

// Bind all inputs and buttons to specific functions
Monolith.prototype.bindInputs = function () {
    var that = this;

    $(document).on("click", "#button-publish", function () {
        that.publish();
    });

    $(document).on("click", "#button-left", function () {
        that.turn(-1);
    });

    $(document).on("click", "#button-right", function () {
        that.turn(1);
    });

    $(document).on("click", "#button-read", function () {
        that.read();
    });
}

Monolith.prototype.onReady = function () {
    this.bindInputs();
    this.init();
    showStatus("DApp loaded successfully.");
}

if (typeof (Contracts) === "undefined") var Contracts = { Monolith: { abi: [] } };
var monolith = new Monolith(Contracts['Monolith']);


// Show status on bottom of the page when some action happens
function showStatus(text) {
    $("#message").empty();
    $("#message").append(text);
}

function isValidAddress(address) {
    return /^(0x)?[0-9a-f]{40}$/i.test(address);
}

$(document).ready(function () {
    monolith.onReady();
});
