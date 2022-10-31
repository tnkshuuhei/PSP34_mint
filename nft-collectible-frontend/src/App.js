import './App.css';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { Button, Container, Row, Col, Form, Collapse } from "react-bootstrap";
import {
    web3Accounts,
    web3Enable,
    web3AccountsSubscribe,
    web3FromAddress,
    web3ListRpcProviders,
    web3UseRpcProvider,
    web3FromSource
} from '@polkadot/extension-dapp';
import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import ContractABI from "./psp34Contract.json";
import React, { useEffect, useState } from "react";
import * as S from "./style";
import Globalmenu from './components/Globalmenu.js';
import styled from "styled-components";

const WS_PROVIDER = 'wss://shibuya.public.blastapi.io'
const DAPP_NAME = 'Mint psp34NFT'

function App() {
    useEffect(() => { 
        checkIfWalletIsConnected();
    }, []); 
    const CONTRACT_ADDRESS = "YUXuMznMWLcKti9G7QTz29vsz5AtySSWEAuufnDoLAGC6ff";
    const [currentAccount, setCurrentAccount] = useState(null);
    const [allAccounts, setAllAccounts] = useState(null);
    //const [clickMintbtn, setClickMintbtn] = useState(false);

    const [nftname, setNftname] = useState(null);
    const [nftdescript, setNftdescript] = useState(null);
    const [nftimg, setNftimg] = useState(null);
    const [nftdate, setNftdate] = useState(null);

    const checkIfWalletIsConnected = async () => {
        try {
            const extensions = await web3Enable(DAPP_NAME);
            if (extensions.length === 0) {
                // no extension installed, or the user did not accept the authorization
                // in this case we should inform the use and give a link to the extension
                return;
            }
            const allAccounts = await web3Accounts();
            setCurrentAccount(allAccounts[0]);
        } catch (error) {
            console.error(error)
        }
    };

    const connectWalletHanlder = async () => {
        try {
            const extensions = await web3Enable(DAPP_NAME);
            if (extensions.length === 0) {
                // no extension installed, or the user did not accept the authorization
                // in this case we should inform the use and give a link to the extension
                return;
            }
            const allAccounts = await web3Accounts();
            setCurrentAccount(allAccounts[0]);
        } catch (error) {
            console.error(error)
        }
    };

    const mintNftHandler = async () => {
        if (allAccounts) {
            const provider = new WsProvider(WS_PROVIDER);
            const api = await ApiPromise.create({ provider });
            const psp34 = new ContractPromise(api, ContractABI, CONTRACT_ADDRESS);

            const gasLimit = -1;
            const injector = await web3FromSource(currentAccount.meta.source);
            const mintTokenExtrinsic = await psp34.tx.mintToken({ gasLimit });
            
            mintTokenExtrinsic.signAndSend(currentAccount.address, { signer: injector.signer }, ({ status }) => {
                if (status.isInBlock) {
                    console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                } else {
                    console.log(`Current status: ${status.type}`);
                }
            }).catch((error) => {
                console.log(':( transaction failed', error);
            });
        }
    }

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHanlder} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }

    const mintNftButton = () => {
        return (
            <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
                Mint NFT
            </button>
        )
    }

    const setName = (e) => {
        setNftname(e);
    }

    const setDescript = (e) => {
        setNftdescript(e);
    }

    const setDate = (e) => {
        setNftdate(e);
    }

    const setNftimage = (e) => {
        setNftimg(e);
    }

    const collapseVisible = () => {
        return (
            <S.Collapse>
                <Collapse in={currentAccount}>
                    <S.Container_Mi>
                        <Form>
                            <Form.Group className="mb-3" controlId="mintForm.ControlInput1">
                                <Form.Label>NFT Name</Form.Label>
                                <Form.Control type="text" placeholder="Your NFT's name" onChange={e => setName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="mintForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" placeholder="About nft" onChange={e => setDescript(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="mintForm.ControlTextarea1">
                                <Form.Label>Date</Form.Label>
                                <Form.Control as="textarea" placeholder="Date" onChange={e => setDate(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="mintForm.File" className="mb-3">
                                <Form.Label>Upload Image File for NFT</Form.Label>
                                <Form.Control type="file" onChange={e => setNftimage(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </S.Container_Mi>
                </Collapse>
            </S.Collapse>

        )
    }


    return (
        <div>
            <BG_Container>
                <BrowserRouter>
                    <Globalmenu />
                </BrowserRouter>
                <div className='main-app'>
                    <h1>PSP34 Contract</h1>
                    <div>
                        {currentAccount ? mintNftButton() : connectWalletButton()}
                    </div>
                </div>
                <div>
                    {currentAccount ? collapseVisible() : null}
                </div>
            </BG_Container>
        </div>
    );
}

const BG_Container = styled.div`
    color: white;
    position: absolute;
    width: 100%;
    height: 100%;
    background: #191d1f;
`;

export default App;