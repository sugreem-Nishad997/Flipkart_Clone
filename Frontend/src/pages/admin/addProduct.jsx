import { useContext, useState } from 'react';
import '../../styles/admin.css';
import {
    TextField,
    Button,
    Typography,
    Grid,
    Box,
    ToggleButtonGroup,
    ToggleButton,
    Paper,
    Select,
    MenuItem,
    IconButton,
    LinearProgress,
    Fade,
    Snackbar,
    Alert,
    Slide,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Add, Close, Remove } from '@mui/icons-material';
import { AuthContext } from '../../Context/AuthContext';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const genders = ['Men', 'Woman'];
const Category = ['mobile', 'laptop', 'furniture', 'clothing', 'electronics', 'Beauty', 'other'];

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

const AddProductStyledForm = () => {

    const { addProduct } = useContext(AuthContext);
    const [showImages, setShowImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        size: [],
        gender: '',
        price: '',
        stock: '',
        discount: '',
        category: '',
        brand: '',
        images: [],
        specs: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (event, newSizes) => {
        setFormData(prev => ({ ...prev, size: newSizes }));
    };

    const handleGenderChange = (event, newGender) => {
        setFormData(prev => ({ ...prev, gender: newGender }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map(file => URL.createObjectURL(file));
        setShowImages(prev => ([...prev, urls]));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const handleSpecChange = (index, key, value) => {
        const newSpecs = [...formData.specs];
        newSpecs[index] = { ...newSpecs[index], [key]: value };
        setFormData({ ...formData, specs: newSpecs });
    };

    const addSpecField = () => {
        setFormData({
            ...formData,
            specs: [...formData.specs, { key: "", value: "" }],
        });
    };

    const removeSpecField = (index) => {
        const newSpecs = [...formData.specs];
        newSpecs.splice(index, 1);
        setFormData({ ...formData, specs: newSpecs });
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async (Transition) => {
        setLoading(true);
        if ((formData.category === 'laptop' || 'mobile' || 'electronics') && (formData.specs.length === 0)) {
            setMessage({ ms: "Specifications required", color: 'orange', type: 'warning' });
            setSnakeOpen({ open: true, Transition });
        }
        const form = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            if (Array.isArray(val)) {
                if (key === "specs") {
                    form.append(key, JSON.stringify(val));
                } else {
                    val.forEach((item) => form.append(key, item));
                }
            } else if (typeof val === "object" && val !== null) {
                form.append(key, JSON.stringify(val));
            } else {
                form.append(key, val);
            }
        });

        try {
            let result = await addProduct(form);
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                setSnakeOpen({ open: true, Transition });
                setFormData({
                    title: '',
                    description: '',
                    size: [],
                    gender: '',
                    price: '',
                    stock: '',
                    discount: '',
                    category: '',
                    brand: '',
                    images: [],
                    specs: []
                });
            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            setMessage({ ms: error.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='rightPannel' >
            <div className='addProductHeader'>
                <div style={{ height: '2.2rem' }} className='d-flex justify-content-around'>
                    <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flipkart-logo-login-5e2d0b.svg"
                        alt="" className='mt-3 ms-3' onClick={() => navigate("/")} />
                </div>
            </div>
            {loading && <LinearProgress />}
            <div className='mb-2 d-flex justify-content-between p-3'>
                <Typography variant="h6" mb={1}>Add New Product</Typography>
                <Button variant="contained" color="success" onClick={() => handleSubmit(SlideTransition)} disabled={loading && true}>
                    Add Product
                </Button>
            </div>
            <Grid container spacing={3} sx={{ opacity: loading && '0.5' }} p={2}>
                {/* General Info */}
                <div className='section-1'>
                    <Grid xs={12} md={8}>
                        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                            <Typography fontWeight={600} mb={2}>General Information</Typography>
                            <TextField
                                label="Name Product"
                                name="title"
                                fullWidth
                                size='small'
                                value={formData.title}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                                disabled={loading && true}
                            />
                            <TextField
                                label="Description Product"
                                name="description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                                disabled={loading && true}
                                sx={{ mb: 1 }}
                            />


                        </Paper>

                        {/* Pricing & Stock */}
                        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                            <Typography fontWeight={600} mb={2}>Pricing And Stock</Typography>
                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <TextField
                                        label="Base Pricing"
                                        name="price"
                                        fullWidth
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        disabled={loading && true}
                                        size='small'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Stock"
                                        name="stock"
                                        fullWidth
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        disabled={loading && true}
                                        size='small'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Discount"
                                        name="discount"
                                        fullWidth
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        disabled={loading && true}
                                        size='small'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Brand"
                                        name="brand"
                                        fullWidth
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        disabled={loading && true}
                                        size='small'
                                    />
                                </Grid>

                            </Grid>
                        </Paper>

                        {/* Category */}
                        <div className='category'>
                            <Box>
                                <Typography fontWeight={600}>Category</Typography>

                                <Grid xs={6}>
                                    <Select
                                        displayEmpty
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        sx={{ height: '2.3rem' }}
                                        disabled={loading && true}
                                    >
                                        <MenuItem value="" disabled>Select Category</MenuItem>
                                        {Category.map(type => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Box>
                            {formData.category === 'clothing' && <> <Box>
                                <Typography variant="subtitle2" fontWeight={600} >Size</Typography>
                                <ToggleButtonGroup
                                    value={formData.size}
                                    onChange={handleSizeChange}
                                    multiple
                                    size="small"
                                >
                                    {sizes.map(size => (
                                        <ToggleButton key={size} value={size}>
                                            {size}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>

                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>Gender</Typography>
                                    <ToggleButtonGroup
                                        value={formData.gender}
                                        exclusive
                                        onChange={handleGenderChange}
                                        size="small"
                                    >
                                        {genders.map(g => (
                                            <ToggleButton key={g} value={g}>
                                                {g}
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Box></>}

                        </div>
                    </Grid>
                </div>

                {/* Image Upload */}
                {/* Submit */}
                <div className='section-2'>
                    <Grid item xs={12} md={4} sx={{ width: '100%' }}>
                        <Paper elevation={2} sx={{ p: 3, width: '100%' }}>
                            <Typography fontWeight={600} mb={2}>Upload Img</Typography>

                            <Box
                                sx={{
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    mb: 2,
                                    bgcolor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {showImages[0] ? (
                                    <img
                                        src={showImages[0]}
                                        alt="Product"
                                        style={{ width: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No image</Typography>
                                )}
                            </Box>

                            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                                {showImages.map((img, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            position: 'relative',
                                            width: 60,
                                            height: 60,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            border: i === 0 ? '2px solid #4caf50' : '1px solid #ccc',
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`thumb-${i}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveImage(i)}
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                bgcolor: 'white',
                                                border: '1px solid #ccc',
                                                boxShadow: 1,
                                                zIndex: 2,
                                                ':hover': { backgroundColor: 'white', color: 'black' }
                                            }}
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>


                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<AddPhotoAlternateIcon />}
                                fullWidth
                                disabled={loading && true}
                            >
                                Upload Image
                                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} pt={2}>
                        <Typography variant="subtitle1">Specifications</Typography>
                        {formData.specs.map((spec, index) => (
                            <Box key={index} display="flex" gap={1} alignItems="center" mb={1}>
                                <TextField
                                    label="Key"
                                    value={spec.key}
                                    onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                                    size='small'
                                />
                                <TextField
                                    label="Value"
                                    value={spec.value}
                                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                    size='small'
                                />
                                <IconButton onClick={() => removeSpecField(index)}>
                                    <Remove />
                                </IconButton>
                            </Box>
                        ))}
                        <Button onClick={addSpecField} startIcon={<Add />} disabled={loading && true}>
                            Add Specification
                        </Button>
                    </Grid>
                </div>

            </Grid>
            <Snackbar
                open={snakeOpen.open}
                onClose={handleClose}
                slots={{ transition: snakeOpen.Transition }}
                autoHideDuration={2200}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key={snakeOpen.Transition.name}
            >
                <Alert
                    onClose={handleClose}
                    severity={message.type}
                    variant='filled'
                    sx={{ color: 'white', backgroundColor: 'black', '& .MuiAlert-icon': { color: message.color } }}
                >
                    {message.ms}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddProductStyledForm;
