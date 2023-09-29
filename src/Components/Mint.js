import React from 'react'
import { useState,useEffect } from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3';
import axios from 'axios';
import './Styles.css'
const Mint = (props) => {
    const [filelink,setFileLink] = useState();
    const [file,setFile] = useState(false);
    const [uploadstatus,setUploadS] = useState();
    const [MintStatus,setMintStatus] = useState();
    useEffect(()=>{
        const handler = async(e) =>{
          try{
            setUploadS("Please wait..")
            const formData = new FormData();
            formData.append("file",file);
            const redFile = await axios({
              method:"post",
              url:'https://api.pinata.cloud/pinning/pinFileToIPFS',
              data:formData,
              headers:{
                pinata_api_key :'0b6bf946316368bcbb61',
                pinata_secret_api_key:"d192fbb4b16b345884aa4315ad92f5eab998a840fab81ef57a1abcb0aa565185",
                "Content-Type":"multipart/form-data",
              }
            });
            const ImgHash =`https://ipfs.io/ipfs/${redFile.data.IpfsHash}`;
            setFileLink(ImgHash);
            setUploadS();
          }catch(e){
            alert("Unable to upload try again");
            console.log(e)
          }
        }
        file && handler();
    },[file])
    const onchangeHadler = async(e) =>{
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () =>{
          setFile(e.target.files[0]);
        };
    }
    const submithandler=async(e)=>{
      e.preventDefault();
      const price = document.querySelector("#price").value;
      const nftname = document.querySelector("#nftname").value;
      const Description = document.querySelector("#nftDescriptiom").value;
      try{
        const amount ={value : ethers.utils.parseEther("0.00001")}
         const transaction = await props.contract.MintNFT(filelink,price,nftname,Description,amount);
        setMintStatus("Please Wait...");
         await transaction.wait();
         setMintStatus("");
         alert("Uploaded Successfull");
         window.location.reload();
      }catch(e){
        setMintStatus("");
        console.log(e);
        alert("Faild to upload try again");
      }
    }
  return (props.trigger)?(
    <div class="upload-body">
    <br/><br/>
    <center>
    <div class="upload-form">
      <center>
        <h5>UPLOAD NFT</h5><br/>
        <form class="form-group" onSubmit={submithandler}>
            <input type="text" value={props.account} class="form-control"/><br/>
            <input type="text" placeholder='NFT Name' class="form-control" id="nftname"/><br/>
            <input type="text" placeholder='Description' class="form-control" id="nftDescriptiom"/><br/>
            <input type="text" placeholder='Price (Wei)' class="form-control" id="price"/><br/>
            <input type="file" onChange={onchangeHadler} id="fl" class="form-control"/><br/>
            <p>{uploadstatus}</p>
            <input type="submit" value={"LIST"} class="btn btn-secondary"/>
        </form>
        <span>{MintStatus}</span><br/>
        <button onClick={()=>props.setTrigger(false)} class="btn btn-danger">CLOSE</button>
        </center>
    </div>
    </center>
  </div>):""
}

export default Mint
