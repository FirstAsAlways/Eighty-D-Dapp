import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "./../../redux/data/dataActions";
import * as s from "./../../styles/globalStyles";
import Loader from "../../components/Loader/loader";
const truncate = (input, len) =>
    input.length > len ? `${input.substring(0, len)}...` : input;

function Stake() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    const [totalStaked, setTotalStaked] = useState(0);
    const [totalMinted, setTotalMinted] = useState(0);
    const [supply, setTotalSupply] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reveal, setReveal] = useState(true);
    const [userNFTToken, setuserNFTToken] = useState([]);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        WEI_COST: 0,
        DISPLAY_COST: 0,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: false,
    });

    const getConfig = async () => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };


    const getData = async () => {
        setLoading(true);
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));

            // Total Overall NFTs Minted
            const totalSupply = await blockchain.smartContract.methods
                .totalSupply()
                .call();
            setTotalSupply(totalSupply);

            // Total Staked 
            const totalStaked = await blockchain.smartContract.methods
                .totalStaked()
                .call();
            setTotalStaked(totalStaked);

            // Total Minted
            const totalMinted = await blockchain.smartContract.methods
                .balanceOf(blockchain.account)
                .call();
            setTotalMinted(totalMinted);

            // Revealed or Not
            const reveal = await blockchain.smartContract.methods
                .revealed()
                .call();
            setReveal(reveal);

            // Get User Minted NFT
            const tokenIds = await getUserMintedNFT(totalSupply, blockchain.account);
            setuserNFTToken(tokenIds);


            // Total Claimed API Call
        }
    };

    useEffect(() => {
        getConfig();
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    const getUserMintedNFT = async (tsupply, account) => {
        const tokenIds = [];
        for (let i = 0; i < tsupply; i++) {
            const token = await blockchain.smartContract.methods
                .ownerOf(i)
                .call();

            if (token === account) {
                tokenIds.push(i);
            }
        }
        return tokenIds;
    }

    return (
        <>
            {loading && <Loader />}
            <s.Image src={"config/images/logo.png"} wid={"15"} style={{
                "marginTop": "25px"
            }} />
            <s.SpacerLarge /><s.SpacerLarge />
            <div className="container" style={{ width: "15%" }}>
                {blockchain.account !== "" &&
                    blockchain.smartContract !== null &&
                    blockchain.errorMsg === "" ? (
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <div className="btn btn-info btn-lg">

                            {truncate(blockchain.account, 15)}
                        </div>

                    </s.Container>
                ) : (
                    ""
                )}
            </div>
            <s.SpacerLarge />
            {/* Header */}
            <div className="container">
                <div className="row ">
                    <div className="col-md-4">
                        <div className="card  mx-sm-1 p-3">
                            <div className=" text-white p-3 m-auto " >
                                <span className="fa fa-info-circle" aria-hidden="true"></span>
                            </div>
                            <div className="text-white text-center mt-3"><h4>NFT's Minted</h4></div>
                            <div className="text-white text-center mt-2"><h1>{totalMinted}</h1></div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-white mx-sm-1 p-3">
                            <div className=" text-white p-3 m-auto " >
                                <span className="fa fa-hourglass" aria-hidden="true"></span>
                            </div>
                            <div className="text-white text-center mt-3"><h4>Total Claimed</h4></div>
                            <div className="text-white text-center mt-2"><h1>9332</h1></div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-white mx-sm-1 p-3">
                            <div className=" text-white p-3 m-auto " >
                                <span className="fa fa-window-restore" aria-hidden="true"></span>
                            </div>
                            <div className="text-white text-center mt-3"><h4>Total Staked</h4></div>
                            <div className="text-white text-center mt-2"><h1>{totalStaked}</h1></div>
                        </div>
                    </div>
                </div>
            </div>

            <s.SpacerLarge />

            {/* NFT's Section */}

            <div className="jumbotron container" style={{
                background: "#01014D !important"
            }}>
                {blockchain.account !== "" &&
                    blockchain.smartContract !== null &&
                    blockchain.errorMsg === "" ? (
                    <>
                        <h2 className="title">My NFT's</h2>
                        <s.SpacerLarge />
                        <div className="flex-container">
                            {
                                userNFTToken.length > 0 ? (
                                    userNFTToken.map((nft, index) => {
                                        return <div className="flex-item border" key={index}>
                                            {reveal ? <s.Image  ></s.Image> :
                                                <s.Image className="p-3" src={"https://gateway.pinata.cloud/ipfs/QmRNFA8GXxeJ24iTEYJB9JTzd1ZzzcPgX5SstGf5acFnxP"}
                                                    wid={"80"}></s.Image>}
                                                    
                                        </div>
                                    })
                                ) : (
                                    <div className="col-md-12">
                                        <p>You don't have any NFTs Stacked!!!</p>
                                    </div>
                                )
                            }

                        </div>
                      
                    </>
                ) : (
                    <>
                        <s.connectButton
                            style={{
                                textAlign: "center",
                                color: "#fff",
                                cursor: "pointer",
                                margin: "auto",
                                display: "block",
                                background: "#17a2b8",
                                border: "#17a2b8"
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(connectWallet());
                                setTimeout(() => {
                                getData();
                                setLoading(false);
                                },2500);
                            }}
                            wid = {"35%"}
                        >
                            Connect Wallet
                        </s.connectButton>
                    </>
                )}

            </div>
        </>
    );

}

export default Stake;