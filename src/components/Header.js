import React from 'react'

const Header = ({accounts, balances}) => {
    return (
        <div className="jumbotron mt-3">
            <h5>Your Account Address: {accounts}</h5>
            <h5>Your Account Balance: {window.web3.utils.fromWei(balances.toString(), 'Ether')} Eth</h5>
        </div>
    )
}

export default Header
