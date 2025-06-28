import '../../styles/profileInfo.css';
import AddIcon from '@mui/icons-material/Add';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import { Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function address() {

    const [open, setOpen] = useState(false);
    const[moreOpen, setMoreOpen] = useState(false);
    const[radio, setRadio] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        pincode: "",
        locality: "",
        area: "",
        city: "",
        state: "",
        addressType:""

    });
    const [addresses, setAddresses] = useState([{}]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
   

    const saveChanges = () => {
        setAddresses((prev) => {
            return [...prev, formData]
        })
        setFormData({
             name: "",
        mobile: "",
        pincode: "",
        locality: "",
        area: "",
        city: "",
        state: "",
        addressType:""
        });
        setOpen(!open)
    }


    return (
        <div style={{ backgroundColor: 'rgb(234, 240, 245)', padding: '0.9rem', width: '70%' }}>
            <div style={{ backgroundColor: 'white' }} className="p-5">
                <div className="mb-3">
                    <h6>Manage Addresses</h6>
                </div>
                <div className='address'>
                    <div style={{ display: open ? 'none' : '' }}>
                        <AddIcon sx={{ color: 'rgb(0, 132, 255)' }} />
                        <span className='ms-3 text-primary' style={{ fontSize: '0.95rem', fontWeight: '500' }} onClick={() => setOpen(!open)}>Add A New Address</span>
                    </div>
                    <div style={{ display: open ? '' : 'none' }}>
                        <p className='ms-1 text-primary' style={{ fontSize: '0.95rem', fontWeight: '500' }}>Add A New Address</p>
                        <div>
                            <div className='d-flex'>
                                <div style={{ position: 'relative', width: '280px' }}>
                                    <input type="text" name='name'
                                        className='name-input' value={formData.name} onChange={handleChange} />
                                    <label htmlFor="name" className='name-label'>Name</label>
                                </div>
                                <div style={{ position: 'relative', width: '280px', marginLeft: '2rem' }}>
                                    <input type="text" name='mobile'
                                        className='name-input' value={formData.mobile} onChange={handleChange} />
                                    <label htmlFor="mobile" className='name-label'>10-digit mobile number</label>
                                </div>
                            </div>

                            <div className='d-flex mt-3'>
                                <div style={{ position: 'relative', width: '280px' }}>
                                    <input type="text" name='pincode'
                                        className='name-input' value={formData.pincode} onChange={handleChange} />
                                    <label htmlFor="pincode" className='name-label'>Pincode</label>
                                </div>
                                <div style={{ position: 'relative', width: '280px', marginLeft: '2rem' }}>
                                    <input type="text" name='locality'
                                        className='name-input' value={formData.locality} onChange={handleChange} />
                                    <label htmlFor="locality" className='name-label'>Locality</label>
                                </div>
                            </div>

                            <div className='d-flex mt-4'>
                                <div style={{ position: 'relative', width: '595px' }}>
                                    <input type="text" name='area'
                                        className='name-input' style={{ height: '5rem' }} value={formData.area} onChange={handleChange} />
                                    <label htmlFor="area" className='name-label'>Address(Area and Street)</label>
                                </div>
                            </div>

                            <div className='d-flex mt-3'>
                                <div style={{ position: 'relative', width: '280px' }}>
                                    <input type="text" name='city'
                                        className='name-input' value={formData.city} onChange={handleChange} />
                                    <label htmlFor="city" className='name-label'>City/District/Town</label>
                                </div>
                                <div style={{ position: 'relative', width: '280px', marginLeft: '2rem' }}>
                                    <input type="text" name='state'
                                        className='name-input' value={formData.state} onChange={handleChange} />
                                    <label htmlFor="state" className='name-label'>State</label>
                                </div>
                            </div>

                            <div className='d-flex mt-3'>
                                <div style={{ position: 'relative', width: '280px' }}>
                                    <input type="text" name='name'
                                        className='name-input' />
                                    <label htmlFor="name" className='name-label'>Landmark(Optional)</label>
                                </div>
                                <div style={{ position: 'relative', width: '280px', marginLeft: '2rem' }}>
                                    <input type="text" name='name'
                                        className='name-input' />
                                    <label htmlFor="name" className='name-label'>Alternate Phone(Optional)</label>
                                </div>
                            </div>

                            <div className="mt-3">
                                <FormControl>
                                    <p style={{ fontSize: '0.7rem', color: 'gray' }}>Address Type</p>
                                    <RadioGroup
                                        row
                                        name="row-radio-buttons-group"
                                        sx={{ marginTop: '-0.5rem' }}
                                    >
                                        <FormControlLabel value='Home' name='addressType' control={<Radio sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 17,
                                            },
                                        }} onClick={handleChange}/>} label="Home" />
                                        <FormControlLabel value="Office" name='addressType' control={<Radio sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 17,
                                            },
                                        }}onClick={handleChange} />} label="Office" />
                                    </RadioGroup>
                                </FormControl>
                            </div>

                            <div className='mt-3'>
                                <div className='d-flex'>
                                    <button className='btn btn-primary' style={{ width: '9rem' }} onClick={saveChanges}>SAVE</button>
                                    <Button sx={{ marginLeft: '1rem' }} onClick={() => setOpen(!open)}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-4'>
                    {addresses.map((add) => {
                        return (
                            <div style={{ border: '1px solid gainsboro', padding: '1rem' }}>
                                <div className='d-flex justify-content-between'>
                                    <p className='addressType'>{add.addressType}</p>
                                    <div className='addressEdit' style={{display:moreOpen?'':'none'}} onMouseLeave={()=>setMoreOpen(!moreOpen)}>
                                        <p onClick={()=>setOpen(!open)}>Edit</p>
                                        <p>Delete</p>
                                    </div>
                                   <div style={{display:moreOpen?'none':''}} onMouseEnter={()=>setMoreOpen(!moreOpen)}>
                                         <MoreVertIcon/>
                                   </div>
                                </div>
                                <div>
                                    <span>{add.name}</span>
                                    <span className='ms-5' style={{ fontWeight: '600' }}>{add.mobile}</span>
                                </div>
                                <div>
                                    <span> {add.locality},{add.city}, {add.state}</span>
                                    <span style={{ fontWeight: '600' }}>- {add.pincode}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}