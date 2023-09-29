  import React, { useEffect, useState } from 'react'
  import "./Styles.css"
  const MyProducts = (props) => {
      const [product,setProduct] = useState({});
      const [Userinfo,setUserInfo] = useState();
      useEffect(()=>{
        //Getting User Information
          const getData = async(e)=>{
            try{
              const data1 = await props.contract.GetUserData(props.account)
              setUserInfo(data1)
              const data = await props.contract.GetAllNFTs();
            for (let i = 0; i <data.length; i++){
              if(data[i].owner === props.account || data[i].seller == props.account){ 
                const ProductID = data[i][0].toString()
                const imageUrl = data[i][1];
                const price =data[i][4].toString();
                const status = data[i][5];
                const nftname = data[i][6].toString();
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                  [ProductID]: [nftname,imageUrl,price,status]
                }));}
            }
            console.log(product)
          }catch(e){console.log(e)}}
          props.contract && getData();
      },[props.contract,product])

      //handler for Reselling the NFT
      const hadndler = async(e,ProductId)=>{
        e.preventDefault()
        var UpdatedNFTName = prompt("Enter UpdateName:")
        var updatedPrice = prompt("Enter Price:");
        var UpdatedDescription = prompt("Enter Description");
        try{
          const transaction = await props.contract.Resale(ProductId,updatedPrice,UpdatedDescription,UpdatedNFTName)
          await transaction.wait()
          alert("Resale Successfull..")
        }catch(e){
          console.log(e);
          alert("Faild!! try again..")
        }
      }
    return(props.trigger)?(
      <div class="outer">
        <center>
        <h4><b>YOUR INFO</b></h4><br/>
        <img src={Userinfo[2]} class="profileclass" height="100px" width="100px"/><br/><br/>
        <span><b>{Userinfo[0]} {Userinfo[1]}</b></span><br/><br/>
      </center><br/>
      {Object.keys(product).length==0?<h5><center>You dont Have NFTs</center></h5>:<h3>YOUR NFTS</h3>}
      <div className="inner">
      {Object.entries(product).map(([ProductID,[nftname,imageUrl,price,status]], index) => (
            <div className="Productitem" key={index}>
              <div className="productbody">
                <center>
                  <img src={imageUrl} width="260px" height="200px" alt="Product" /><br/><br/>
                  <p>{nftname}</p>
                  <p><b>Price: {price} Wei</b></p>
                  <p>{status == true ? <p>NFT in Sale</p>:<button class='btn btn-secondary' onClick={(e)=>hadndler(e,ProductID)}>Resale</button>}</p>
                </center>
              </div>
            </div>
          ))}
          </div>
          <br/>
          <center><button onClick={()=>props.setTrigger(false)} class="btn btn-danger">close</button></center>
      </div>
    ):""
  }

  export default MyProducts