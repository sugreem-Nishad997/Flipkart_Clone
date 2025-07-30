import { useNavigate } from 'react-router-dom';
import '../../styles/home.css';
import { useState } from 'react';
export default function home() {

    const navigate = useNavigate();
    const links = ["Headset", "Smart Watches", "Projectors", "Smart TVs", "Printers"];
    const [linkIndex, setLinkIndex] = useState(0);
    const bestElectronics = [
        {
            title: "Best Truewireless Earebudds",
            url: "https://rukminim1.flixcart.com/image/128/128/kwxv98w0/headphone/s/c/j/-original-imag9hxj7qmmyqmh.jpeg?q=60&crop=false",
            price: 8370
        },
        {
            title: "Best Watches",
            url: "https://rukminim2.flixcart.com/image/128/128/xif0q/smartwatch/m/v/i/-original-imah76cazsbbt8hu.jpeg?q=70",
            price: 1399
        },
        {
            title: "Best Projectors",
            url: "https://rukminim2.flixcart.com/image/128/128/xif0q/projector/4/x/3/atom-3x-native-fhd-1080p-4k-support-13-0-android-projector-300-original-imahbxepqgqurfh7.jpeg?q=70",
            price: 6990
        },
        {
            title: "View Best Monitors",
            url: "https://rukminim2.flixcart.com/image/150/150/xif0q/monitor/l/r/k/-original-imagwdpyagcv2zz6.jpeg?q=70",
            price: 8000
        },
        {
            title: "Best Printers",
            url: "https://rukminim2.flixcart.com/image/150/150/k4a7c7k0/printer/y/j/z/canon-e3370-original-imafn2wyyxjjvzd6.jpeg?q=70",
            price: 10999
        },

    ];
    return (
        <div className='container-1'>
            <div className="catigory-items">
                <div onClick={() => navigate(`/showList/${"Mobiles"}`)} style={{ cursor: 'pointer' }}>
                    <div>
                        <img src="https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100" />
                    </div>
                    <div className='catFont'>Mobiles</div>
                </div>
                <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/showList/${"T-shirts"}`)}>
                    <div>
                        <img src="https://rukminim1.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png?q=100" />
                    </div>
                    <div className='catFont'>Fashion</div>
                </div>
                <div onClick={() => navigate(`/showList/${"Laptops"}`)} style={{ cursor: 'pointer' }}>
                    <div>
                        <img src="https://rukminim1.flixcart.com/flap/158/158/image/69c6589653afdb9a.png?q=100" />
                    </div>
                    <div className='catFont'>Electronics</div>
                </div>

                <div style={{ cursor: 'pointer' }}>
                    <div>
                        <img src="https://rukminim1.flixcart.com/flap/158/158/image/ab7e2b022a4587dd.jpg?q=100" />
                    </div>
                    <div className='catFont'>Home & Furniture</div>
                </div>
                <div style={{ cursor: 'pointer' }}>
                    <div>
                        <img src="https://rukminim1.flixcart.com/flap/158/158/image/dff3f7adcf3a90c6.png?q=100" />
                    </div>
                    <div className='catFont'>Beauty, Toys & More</div>
                </div>
            </div>

            <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel" >
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://rukminim2.flixcart.com/fk-p-flap/960/160/image/e26a921db8ae588e.jpeg?q=60" className="d-block w-100 carousel-img" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/cc08176877cb794a.png?q=60" className="d-block w-100 carousel-img" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/9e51c145e7782e85.jpeg?q=60" className="d-block w-100 carousel-img" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/8b9174109572b3e4.jpeg?q=80" className="d-block w-100 carousel-img" alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className='containerOfBestElec'>
                <h3 style={{ padding: '1rem' }}>Best of Electronics</h3>

                <div className="bestInElectronics">
                    {bestElectronics.map((best, idx) => {
                        return (
                            <div className='bestInElectronics-li' onClick={() => {
                                setLinkIndex(idx)
                                idx === linkIndex && navigate(`/showList/${links[idx]}`)}}
                            key={idx}>
                                <div>
                                    <img src= {best.url}/>
                                </div>
                                <div className='li-tag'>
                                    <p>{best.title}</p>
                                </div>
                                <div className='li-price'>
                                    <p style={{ fontWeight: 'bolder', textAlign: 'center' }}>From {best.price}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='TopDealsContainer'>
                <div className="fashTopDContainer">
                    <h5 style={{ padding: '1rem' }}>Trending Gadgets & Appliances</h5>
                    <div class="row row-cols-2 row-cols-md-2 g-4 row-clos-sm-2 row-cols-xl-2 row-cols-xsm-2" style={{ padding: '0.5rem' }}>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim2.flixcart.com/image/420/420/xif0q/air-cooler/i/m/y/5-5-usb-air-cooler-small-carry-cooler-mini-desk-cooling-fan-with-original-imaha8umwewxztp8.jpeg?q=60" alt="..."></img>
                                </div>
                                <div class="card-body">
                                    <p class="elipse">Air Coolers</p>
                                    <p class="card-text fw-bold text-success">Min. 50% Off</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim2.flixcart.com/image/420/420/xif0q/drone/z/2/k/50-30-30-new-good-quality-quadcopter-e88-wifi-drone-with-wide-original-imaha66vdgbsrrxk.jpeg?q=60" alt="..." />
                                </div>
                                <div class="card-body">
                                    <p class="elipse">Camera's</p>
                                    <p class="card-text fw-bold text-success">Min. 30% Off</p>

                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim2.flixcart.com/image/420/420/xif0q/headphone/t/w/1/comfortable-ear-pads-wireless-headphone-with-aux-support-original-imah9sv7jzpdcbdm.jpeg?q=60" alt="..."></img>
                                </div>
                                <div class="card-body">
                                    <p class="elipse">Wireless Headphones</p>
                                    <p class="card-text fw-bold text-success">Big savings</p>

                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6 ">
                            <div class="card card-1">
                                <div className='custom-img'>
                                    <img src="https://rukminim2.flixcart.com/image/420/420/xif0q/refrigerator-new/g/e/b/-original-imah8vzm36httsbc.jpeg?q=60" alt="..." />
                                </div>
                                <div class="card-body">
                                    <p>Rafrigerators</p>
                                    <p class="card-text fw-bold text-success">Min. 50% Off</p>

                                </div>
                            </div>
                        </div>

                    </div>


                </div>

                <div className="fashTopDContainer">
                    <h5 style={{ padding: '1rem' }}>Season's Top Pics</h5>
                    <div class="row row-cols-2 row-cols-md-2 g-4 row-clos-sm-2 row-cols-xl-2 row-cols-xsm-2" style={{ padding: '0.5rem' }}>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim2.flixcart.com/image/420/420/xif0q/shirt/5/d/y/xxl-frml-st2-vebnor-original-imah89h9ysyg2jth.jpeg?q=60" alt="..."></img>
                                </div>
                                <div class="card-body">
                                    <p class="elipse"> Casual Shirts</p>
                                    <p class="card-text fw-bold text-success">Special Offers</p>

                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim2.flixcart.com/image/420/420/xif0q/wall-clock/r/o/b/handpainted-peacock-wall-clock-32-5-wc-331-analog-divinecrafts-original-imahbzdadxeahpj5.jpeg?q=60" alt="..." />
                                </div>
                                <div class="card-body">
                                    <p class="elipse">Wall Clocks</p>
                                    <p class="card-text fw-bold text-success">Min. 50% Off</p>

                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim2.flixcart.com/image/420/420/xif0q/sari/i/4/w/free-rama-saree-with-fancy-hotfix-work-durvacreation-unstitched-original-imaha7pq45ds9e7b.jpeg?q=60" alt="..."></img>
                                </div>
                                <div class="card-body">
                                    <p class="elipse">Women's Sarees</p>
                                    <p class="card-text fw-bold text-success">Special Offer</p>

                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6 ">
                            <div class="card card-1">
                                <div className='custom-img'>
                                    <img src="https://rukminim2.flixcart.com/image/420/420/l4zxn680/arm-sleeve/p/i/x/free-no-02-cool-arm-sleev-gry-blu-p02-styleacademy-original-imagfs3n9gvhusnp.jpeg?q=60" alt="..." />
                                </div>
                                <div class="card-body">
                                    <p>Arm Sleeves</p>
                                    <p class="card-text fw-bold text-success">Min. 50% Off</p>

                                </div>
                            </div>
                        </div>

                    </div>


                </div>

                <div className="fashTopDContainer">
                    <h5 style={{ padding: '1rem' }}>Fashion's Top Deals</h5>
                    <div class="row row-cols-2 row-cols-md-2 g-4 row-clos-sm-2 row-cols-xl-2 row-cols-xsm-2" style={{ padding: '0.5rem' }}>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim1.flixcart.com/image/170/170/xif0q/shoe/t/g/f/9-100-corsac-red-original-imagzx8v3hzh9tjr.jpeg?q=80" alt="..."></img>
                                </div>
                                <div class="card-body">
                                    <p class="elipse">Men's Casual Shoes</p>
                                    <p class="card-text text-success fw-bold">Min. 70% Off</p>

                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim1.flixcart.com/image/190/190/xif0q/slipper-flip-flop/p/g/d/8-gp-775-black-red-belizza-black-red-original-imah3xxbnvdtzrvw.jpeg?q=80" alt="..." />
                                </div>
                                <div class="card-body">
                                    <p class="elipse">Men's Casual Shoes</p>
                                    <p class="card-text text-success fw-bold">Min. 70% Off</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6">
                            <div class="card card-1">
                                <div className="custom-img">
                                    <img src="https://rukminim1.flixcart.com/image/190/190/xif0q/shopsy-boxer/j/l/t/l-spy-boxer-c26-rusksun-original-imah923zrmvvhsca.jpeg?q=80" alt="..."></img>
                                </div>
                                <div class="card-body">
                                    <p class="elipse">Men's Casual Shoes</p>
                                    <p class="card-text text-success fw-bold">Min. 70% Off</p>

                                </div>
                            </div>
                        </div>
                        <div class="col-xsm-6 ">
                            <div class="card card-1">
                                <div className='custom-img'>
                                    <img src="https://rukminim1.flixcart.com/image/190/200/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=80" alt="..." />
                                </div>
                                <div class="card-body">
                                    <p>BackPacks</p>
                                    <p class="card-text fw-bold text-success">Min. 70% Off</p>

                                </div>
                            </div>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    )
}