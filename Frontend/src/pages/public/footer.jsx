import'../../styles/footer.css';
export default function footer() {
    return(
        <div className="footerContainer">
            <div className="row">
                <div className="col modifiCol">
                    <p className='heading text-uppercase' style={{left:'2rem', position:'relative'}}>About</p>
                    <ul style={{listStyle:'none'}}>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Careers</li>
                        <li>Flipkart Stories</li>
                        <li>Press</li>
                        <li>Corporate Information</li>
                    </ul>
                </div>
                <div className="col">
                    <p className='heading  text-uppercase' style={{left:'2rem', position:'relative'}}>Group Companies</p>
                    <ul style={{listStyle:'none'}}>
                        <li>Myntra</li>
                        <li>Cleartrip</li>
                        <li>Shopsy</li>
                    </ul>
                </div>
                <div className="col">
                    <p className='heading  text-uppercase' style={{left:'2rem', position:'relative'}}>Help</p>
                    <ul style={{listStyle:'none'}}>
                        <li>Payments</li>
                        <li>Shipping</li>
                        <li>Cancellation & Returns</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                <div className="col">
                    <p className='heading text-uppercase' style={{left:'2rem', position:'relative'}}   >Consumer Policy</p>
                    <ul style={{listStyle:'none'}}>
                        <li>Cancellation & Returns</li>
                        <li>Terms of Use</li>
                        <li>Security</li>
                        <li>privacy</li>
                        <li>Sitemap</li>
                        <li>Grivance Redressal</li>
                        <li>EPR Compliance</li>
                    </ul>
                </div>
                <div className="col">
                    <p className='heading'>Mail Us:</p>
                    <p>Flipkart Internet Private Limited, </p>
                    <p> Buildings Alyssa, Begonia & </p>
                    <p> Clove Embassy Tech Village, </p>
                    <p> Outer Ring Road, Devarabeesanahalli Village, </p>
                    <p> Bengaluru, 560103, </p>
                    <p> Karnataka, India</p>
                </div>
                <div className="col">
                    <p className='heading'>Registered Office Address:</p>
                    <p> Flipkart Internet Private Limited,  </p>
                    <p> Buildings Alyssa, Begonia &  </p>
                    <p>  Buildings Alyssa, Begonia &  </p>
                    <p> Outer Ring Road, Devarabeesanahalli Village, </p>
                    <p> Bengaluru, 560103, </p>
                    <p> Karnataka, India </p>
                    <p> CIN : U51109KA2012PTC066107 </p>
                </div>
            </div>
        </div>
    )
}