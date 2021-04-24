import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Color from '../abis/Color.json'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: [],
      balance: '',
      loading: false
    }
  }


  async componentWillMount() {
    //detect metamask
    const metamaskInstalled = typeof window.web3 !== 'undefined'
    this.setState({ metamaskInstalled })
    if (metamaskInstalled) {
      await this.loadWeb3()
      await this.loadBlockchainData()
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    
    const balances = await web3.eth.getBalance(accounts[0]);
    this.setState({ balance: balances })
    
    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    if (networkData) {
      const abi = Color.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      
      const totalSupply = await contract.methods.totalSupply.call()
      this.setState({ totalSupply })
      
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call()
        this.setState({colors: [...this.state.colors, color]})
      }

    } else {
      window.alert("Smart Contract not deplyed to this network..")
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Please Install Metamask...")
    }
  }

  mint = (color) => {
    this.setState({loading: true})
    this.state.contract.methods.mint(color).send({ from: this.state.account })
      .once('recipt', (recipt) => {
        this.setState({
          colors: [...this.state.colors, color],
          loading: false
      })
      })
  }

  render() {
    let content;
    
    if (this.state.loading) {
      content = <div id="loader" className="container text-center">
         <button class="btn btn-primary" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
             Loading... 
          </button>
      </div>
    } else {
      content = <div className="row text-center">
        {this.state.colors.map((color, key) => {
        return (
          <div key={key} className="col-md-3 mb-3">
            <div className="token" style={{backgroundColor: color}}></div>
           <div>{color}</div>  
          </div>
         )
      })}
      </div>
    }

    return (
      <div>
        <Navbar/>
        <Header accounts={this.state.account} balances={this.state.balance}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <form className="form-group" onSubmit={(event) => {
                  event.preventDefault()

                  const color = this.color.value
                  this.mint(color)
                }}>
                  <h2>Mint & Issue Tokens</h2>
                  <input
                    className="form-control mb-1"
                    ref={(input) => {this.color = input}}
                    type="text"
                    required
                    placeholder="eg. #fff"
                  />
                  <br/>
                  <button className="btn btn-success btn-block">Mint</button>
                </form>
              </div>
            </main>
          </div>

          <hr />

          <div className="container">
          {this.state.metamaskInstalled ? content : <div className="container text-center"> <h2 className="text-center">Please Install metamask...</h2> </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
