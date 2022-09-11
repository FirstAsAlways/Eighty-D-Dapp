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
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        getConfig();
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    const getData = async () => {
        console.log("call");
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));

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
        }
    };

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
                        <s.connectButton>
                            {truncate(blockchain.account, 10)}
                        </s.connectButton>{" "}
                    </s.Container>
                ) : (
                    <>
                        <s.connectButton
                            style={{
                                textAlign: "center",
                                color: "#fff",
                                cursor: "pointer",
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(connectWallet());
                                getData();
                            }}
                        >
                            Connect Wallet
                        </s.connectButton>
                    </>
                )}
            </div>

            <div className="jumbotron container">
                <div className="row w-100">
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
        </>
    );

}

export default Stake;