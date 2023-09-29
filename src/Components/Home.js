  import React, { useEffect, useState} from 'react';
  import './Styles.css';
  import Cart from './Cart';
  import Mint from './Mint'
  import Profile from './Profile';
  const Home = (props) => {
    const [items,setItems] = useState({});
    const [total,setTotal] = useState(0);
    const [pop,setPop] = useState(false);
    const [pop2,setPop2] = useState(false);
    const [pop3,setPop3] = useState(false);
    const [NFTs,SetNFts] = useState({})
    useEffect(()=>{
      //Getting ALL NFTS for Home page
      const getNFTs = async () => {
        try{
          const data = await props.contract.GetAllNFTs();
          for (let i = 0; i <data.length; i++) {  
            const NFtID = data[i][0].toString()
            const imageUrl = data[i][1];
            const seller = data[i][3];
            const price =data[i][4].toString();
            const status = data[i][5];
            const nftname = data[i][6].toString();
            const Description = data[i][7];
            SetNFts((prevNFTs) => ({
              ...prevNFTs,
            [NFtID]: [nftname,imageUrl,price,status,seller,Description]
          }));
        }
        }catch(e){
          console.log(e); 
        }
      };
      props.contract && getNFTs();
    },[props.contract,total]);

    //This handler adds NFTs to Cart

    const handleBuyClick = (nftname,price,imageUrl,ProductID,seller) => {
        if(props.account == seller){alert("Owner Can't Buy Own NFT")}
        else{
          setItems((prevCart) => ({
            ...prevCart,
          [ProductID]: [nftname,imageUrl,price],
          }));
        setTotal(total+parseInt(price));  
        alert("Added to Cart")
        }

    }
    return (
      <div>
        <div className="header">
          <a href="#deftault" className="logo">NFT MarketPlace</a>
          <div className="header-right">
          <a onClick={()=>{localStorage.removeItem('isLoggedIn');props.setIsLoggedIn(false);}}>SIGN OUT</a>       
            <a onClick={()=>{setPop3(true);setPop(false);setPop2(false)}}>PROFILE</a>
            <a onClick={()=>{setPop2(true);setPop(false);setPop3(false)}}>LIST NFT</a>
            <a onClick={()=>{setPop(true);setPop2(false);setPop3(false)}}>CART</a>
          </div>
        </div>
        <Mint trigger ={pop2}  setTrigger={setPop2} contract = {props.contract} account={props.account} >

        </Mint>
        <Profile trigger = {pop3} setTrigger={setPop3} contract={props.contract} account={props.account}>

        </Profile>
        <Cart trigger={pop} setTrigger={setPop} cartItems={items} Products = {NFTs} items ={items} setProducts={SetNFts} setItem={setItems} TotalPayment ={total} setTotalPayment={setTotal} contract = {props.contract} account={props.account}>

        </Cart>
        {pop === false && pop2 == false && pop3 == false?
        <div className="outer">
        <center><a>CONNECTED TO: {props.account}</a></center><br/>
          <h3>LIVE NFTS</h3>
          {Object.keys(NFTs).length == 0 ?<center><h5>Currently No Live NFTS</h5></center>:""}
          <div className="inner">
            {Object.entries(NFTs).map(([ProductID,[nftname,imageUrl,price,status,seller,Description]], index) => (
              status == false ?"":
              <div className="Productitem" key={index}>
                <div className="productbody">
                  <center>
                    <img src={imageUrl} width="260px" height="200px" alt="Product" />
                    <p>{nftname}</p>
                    <span><b>{seller}</b></span><br/>
                    <span><b>{Description}</b></span>
                    <p><b>Price: {price} Wei</b></p>
                    <button onClick={() => {handleBuyClick(nftname,price,imageUrl,ProductID,seller)}} class="btn btn-dark">ADD CART</button>
                  </center>
                </div>
              </div>
            ))}
          </div>
        </div> : ""}
      </div>
    );
  };
  export default (Home);

