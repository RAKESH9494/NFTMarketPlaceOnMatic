import React, { useEffect, useState } from 'react';
import "./Styles.css"
import { ethers } from 'ethers';
const Cart = (props) => {
  const [paystaus,Setpaystatus] = useState();
  useEffect(()=>{
  },[props.contract,props.items])
  
  //This handler performs buying NFT operation
  
  const handler = async(e,price) => {
    e.preventDefault();
    try{
      const amount = { value: ethers.BigNumber.from("1000")}; 
      const productIDs = Object.keys(props.items);
      const transaction = await props.contract.BuyNFT(productIDs,amount);
      Setpaystatus("Please wait ...");
      await transaction.wait();
      props.setItem({});
      props.setTotalPayment(0);
      Setpaystatus("");
      alert("Payment Successfull");
      props.setTrigger(false);
    }catch(e){
      Setpaystatus("");
      console.log(e);
      alert("Payment failed try again..")
    }
  };
  return(props.trigger) ?( props.TotalPayment!==0 ?
  <div className="outer">
  <h3>MY CART</h3>
  <div className="inner">
    {props.items && Object.entries(props.items).map(([ProductID,[nftname,imageUrl,price]], index) => (
      <div className="Productitem" key={index}>
        <div className="productbody">
          <center>
            <img src={imageUrl} width="260px" height="200px" alt="Product"/>
            <p>{nftname}</p>
            <p><b>Price: {price} Wei</b></p>
          </center>
        </div>
      </div>
    ))}
  </div><br/>
  <center><p><b>Total Cost : {props.TotalPayment} Wei</b></p></center>
  <center><button onClick={(e)=>{handler(e,props.TotalPayment)}} class="btn btn-dark">PAY</button></center><br/>
  <center>{paystaus}</center>
  <center><button onClick={()=>props.setTrigger(false)} class="btn btn-danger">close</button></center>
</div>
  :<div class="cartStatus"><center><h3 class="cartstatus">Your cart is Empty</h3><br/><button onClick={()=>props.setTrigger(false)} class="btn btn-danger">close</button></center></div>):"";
};
export default Cart;
