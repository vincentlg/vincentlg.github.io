jQuery(document).ready(function($) {
  "use strict"
  // Unlock Tickets
  var unlockTicket = async function() {
    // Set up popup when button is clicked
    $(".unlock-popup").magnificPopup({
      type: "inline",
      preloader: false,
      focus: "#first_name",

      // When elemened is focused, some mobile browsers in some cases zoom in
      // It looks not nice, so we disable it:
      callbacks: {
        beforeOpen: async function() {
          // Capabilities: does the user have a wallet
          // Have they already purchased a ticket?
          if (typeof web3 === "undefined") {
            $(".no-wallet").show()
            $(".has-wallet").hide()
            $(".has-wallet-has-ticket").hide()
            $(".has-wallet-no-ticket").hide()
          } else {
            $(".no-wallet").hide()
            $(".has-wallet").show()
            // Let's ensure we have enabled... just in case it was not done earlier thru Unlock!
            await web3.currentProvider.enable()

            // Get the Unlock status
            const unlockState = unlockProtocol.getState()
            if (unlockState === "unlocked") {
              $(".has-wallet").hide()
              $(".has-wallet-has-ticket").show()
              $(".has-wallet-no-ticket").hide()
            } else {
              $(".has-wallet").hide()
              $(".has-wallet-has-ticket").hide()
              $(".has-wallet-no-ticket").show()
            }
          }
        }
      }
    })

    // When form is submitted (only visible when the user has a wallet)
    $("#unlock-form").on("submit", async function(event) {
      event.preventDefault()

      var web3Provider = new ethers.providers.Web3Provider(web3.currentProvider)
      var lockAddress = Object.keys(unlockProtocolConfig.locks)[0]
      var wallet = web3Provider.getSigner()
      const userAddress = await wallet.getAddress()
      const tokenMetadata = JSON.stringify({
        types: {
          EIP712Domain: [
            {
              name: "name",
              type: "string"
            },
            {
              name: "version",
              type: "string"
            },
            {
              name: "chainId",
              type: "uint256"
            },
            {
              name: "verifyingContract",
              type: "address"
            },
            {
              name: "salt",
              type: "bytes32"
            }
          ]
        },
        domain: {
          name: "Unlock",
          version: "1"
        },
        primaryType: "UserMetaData",
        message: {
          UserMetaData: {
            owner: userAddress,
            data: {
              protected: {
                email: $('#unlock-form input[name="email"]').val(),
                fullName: $('#unlock-form input[name="full_name"]').val(),
                phone: $('#unlock-form input[name="phone"]').val(),
                address_1: $('#unlock-form input[name="address_1"]').val(),
                address_2: $('#unlock-form input[name="address_2"]').val(),
                zipcode: $('#unlock-form input[name="zipcode"]').val(),
                city: $('#unlock-form input[name="city"]').val(),
                country: $('#unlock-form input[name="country"]').val()
              }
            }
          }
        }
      })
      let signature = await web3Provider.send("personal_sign", [
        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(tokenMetadata)),
        userAddress.toLowerCase()
      ])
      const tokenEndpoint = `https://locksmith.unlock-protocol.com/api/key/${lockAddress}/user/${userAddress}`
      $.ajax({
        url: tokenEndpoint,
        type: "PUT",
        data: tokenMetadata,
        contentType: "application/json; charset=utf-8",
        headers: {
          Authorization: `Bearer-Simple ${btoa(signature)}`
        },
        success: function(result) {
          // Great, we saved the Metadata, let's now ask the user to purchase their ticket
          $.magnificPopup.close()
          window.unlockProtocol.loadCheckoutModal()
        },
        error: function(error) {
          alert(
            "We could not save your ticket information. Please try again and report if this persists."
          )
        }
      })
    })
  }
  unlockTicket()
})
