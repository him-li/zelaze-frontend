import * as React from 'react';
import axios from 'axios';
import { POST } from '../utils/api';
import { styled, useTheme } from '@mui/material/styles';
import {
	Avatar,
	Backdrop,
	Box,
	Button,
	ButtonBase,
	Checkbox,
	Grid,
	FormControl,
	FormControlLabel,
	IconButton,
	InputLabel,
	NativeSelect,
	Modal,
	OutlinedInput,
	Tooltip,
	Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import ClassIcon from '@mui/icons-material/Class';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { UserContext } from '../contexts/User';
import { useTranslation } from 'react-i18next';
import { useSpring, animated } from '@react-spring/web';
import pic1 from '../assets/images/needhelp.jpg';
import pic2 from '../assets/images/givehelp.jpg';
import useSnackbar from '../utils/useSnackbar';
import Categories from '../assets/Categories';
import {
	CountryObj,
	EntryObj,
	FadeProps,
	ModalProps,
	SubcategoryObj,
	UserObj,
} from './types';

export default function Entry({ open, handleClose }: ModalProps) {
	const { t } = useTranslation();
	const { SnackbarProps } = useSnackbar();
	const theme = useTheme();
	const user = React.useContext(UserContext) as UserObj;
	const [formData, setFormData] = React.useState<EntryObj>({
		category: '',
		subcategory: '',
		country: '',
		region: '',
		title: '',
		description: '',
		availability: '',
	});
	const categories = Categories();
	const [isCreating, setIsCreating] = React.useState<boolean | null>(null);
	const [isGivingHelp, setIsGivingHelp] = React.useState<boolean>(false);
	const [countries, setCountries] = React.useState<CountryObj[]>([]);
	const [regions, setRegions] = React.useState<Array<string>>([]);
	const [image, setImage] = React.useState<string>('');
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [isUrgent, setIsUrgent] = React.useState<boolean>(false);

	const subcategories: SubcategoryObj[] = React.useMemo(() => {
		const selectedCategoryObj = categories.find(
			(categoryObj) => categoryObj.category === formData.category
		);
		return selectedCategoryObj
			? selectedCategoryObj.subcategories.map((subcategory) => ({
					category: formData.category,
					subcategory,
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  }))
			: [];
	}, [formData.category, categories]);

	const handleChange = (
		event: React.ChangeEvent<{ name?: string; value: unknown }>
	) => {
		setFormData({
			...formData,
			[event.target.name as string]: event.target.value as string,
		});
	};

	React.useEffect(() => {
		const getCountries = async () => {
			try {
				const response = await axios.get(
					'https://countriesnow.space/api/v0.1/countries/positions'
				);
				const data = response.data;
				if (data.error === false) {
					setCountries(data.data);
				}
			} catch (error) {
				console.log(error);
			}
		};

		const getRegions = async () => {
			if (formData.country !== '') {
				try {
					const response = await axios.post(
						'https://countriesnow.space/api/v0.1/countries/cities',
						{ country: formData.country }
					);
					const data = response.data;
					console.log(data);
					if (data.error === false) {
						setRegions(data.data);
					}
				} catch (error) {
					console.log(error);
				}
			}
		};
		getCountries();

		if (formData.country) {
			getRegions();
		}
	}, [formData.country]);

	const handleThumbnail = () => {
		if (!inputRef.current?.files?.length) {
			return;
		}
		const file = inputRef.current.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result as string;
			setImage(result);
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const body = {
			isgivinghelp: isGivingHelp,
			category: formData.category + ' ' + formData.subcategory,
			country: formData.country,
			region: formData.region,
			title: formData.title,
			description: formData.description,
			availability: formData.availability,
			image,
			isurgent: isUrgent,
			userid: user.id,
		};
		const data: EntryObj = await POST('/entries', body);
		if (typeof Number(data.id) === 'number') {
			SnackbarProps(t('t-entry-success'), true);
			setTimeout(async () => {
				console.log('did it work?' + data.id);
			}, 1000);
		} else {
			SnackbarProps(t('t-entry-failed'), false);
		}
	};

	const images = [
		{
			url: pic1,
			title: t('t-need-help'),
			subtitle: t('t-need-help-desc'),
			width: '50%',
			type: false,
		},
		{
			url: pic2,
			title: t('t-give-help'),
			subtitle: t('t-give-help-desc'),
			width: '50%',
			type: true,
		},
	];

	return (
		<Modal
			keepMounted
			aria-labelledby='search'
			aria-describedby='search'
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					TransitionComponent: Fade,
				},
			}}
		>
			<Fade in={open}>
				<Box sx={style}>
					{images.map((image) => (
						<ImageButton
							focusRipple
							key={image.title}
							style={{
								width: image.width,
								borderRadius: 1,
								display: isCreating === null ? 'inline-block' : 'none',
							}}
							onClick={() => {
								setIsCreating(true);
								setIsGivingHelp(image.type);
							}}
						>
							<ImageSrc
								style={{
									backgroundImage: `url(${image.url})`,
								}}
							/>
							<ImageBackdrop className='MuiImageBackdrop-root' />
							<Image className='MuiTypo-root'>
								<Typography
									variant='h5'
									color='inherit'
									sx={{
										position: 'relative',
										p: 4,
										pt: 2,
										pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
									}}
								>
									{image.title}
								</Typography>
								<Typography
									variant='subtitle1'
									color='inherit'
									sx={{
										position: 'relative',
										p: 4,
										pt: 2,
										pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
									}}
								>
									{image.subtitle}
									<ImageMarked className='MuiImageMarked-root' />
								</Typography>
							</Image>
						</ImageButton>
					))}
					<Grid
						container
						justifyContent='center'
						borderRadius={1}
						boxShadow={5}
						maxHeight='10%'
						bgcolor={
							theme.palette.mode === 'dark'
								? 'rgba(0, 0, 0, 0.7)'
								: 'rgba(255, 255, 255, 0.7)'
						}
						display={isCreating === null ? 'none' : 'flex'}
					>
						<Grid
							item
							xs={12}
							sm={6}
							md={6}
							lg={6}
							p={4}
							display='flex'
							flexDirection='column'
							alignItems='center'
						>
							<Tooltip title={t('t-back')}>
								<IconButton
									onClick={() => {
										setIsCreating(null);
										setFormData({} as EntryObj);
									}}
									size='large'
									style={{ position: 'absolute', top: 5, left: 5 }}
								>
									<ArrowBackIcon />
								</IconButton>
							</Tooltip>
							<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
							<Typography component='h1' variant='h5'>
								{t('t-entry-for')}{' '}
								{isGivingHelp ? t('t-give-help') : t('t-need-help')}
							</Typography>
							<Box component='form' noValidate onSubmit={handleSubmit} mt={4}>
								<NativeSelect
									id='category'
									name='category'
									title='category'
									aria-label='category'
									color='primary'
									onChange={handleChange}
									defaultValue=''
									fullWidth
									IconComponent={CategoryIcon}
								>
									<option disabled value=''>
										{t('t-category')}
									</option>
									{categories.map((categoryObj) => (
										<option
											key={categoryObj.category}
											value={categoryObj.category}
										>
											{categoryObj.category}
										</option>
									))}
								</NativeSelect>
								<NativeSelect
									id='subcategory'
									name='subcategory'
									title='subcategory'
									aria-label='subcategory'
									color='primary'
									onChange={handleChange}
									defaultValue=''
									fullWidth
									IconComponent={ClassIcon}
								>
									<option disabled value=''>
										{t('t-subcategory')}
									</option>
									{subcategories.map((subcategoryObj) => (
										<option
											key={subcategoryObj.subcategory}
											value={subcategoryObj.subcategory}
										>
											{subcategoryObj.subcategory}
										</option>
									))}
								</NativeSelect>
								<NativeSelect
									id='country'
									name='country'
									title='country'
									aria-label='country'
									color='primary'
									onChange={handleChange}
									defaultValue=''
									fullWidth
									IconComponent={ExploreIcon}
								>
									<option disabled value=''>
										{t('t-country')}
									</option>
									{countries.map((item: CountryObj) => (
										<option key={item.iso2} value={item.name}>
											{item.name}
										</option>
									))}
								</NativeSelect>
								<NativeSelect
									id='region'
									name='region'
									title='region'
									aria-label='region'
									color='primary'
									onChange={handleChange}
									defaultValue=''
									fullWidth
									IconComponent={LocationCityIcon}
								>
									<option disabled value=''>
										{t('t-region')}
									</option>
									{regions.map((item: string) => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</NativeSelect>
								<FormControl fullWidth variant='outlined' margin='dense'>
									<InputLabel htmlFor='title'>{t('t-title')}</InputLabel>
									<OutlinedInput
										required
										id='title'
										name='title'
										type='title'
										label={t('t-title')}
										value={formData.title}
										onChange={handleChange}
									/>
								</FormControl>
								<FormControl fullWidth variant='outlined' margin='dense'>
									<InputLabel htmlFor='description'>
										{t('t-description')}
									</InputLabel>
									<OutlinedInput
										required
										multiline
										id='description'
										name='description'
										type='description'
										label={t('t-description')}
										value={formData.description}
										onChange={handleChange}
									/>
								</FormControl>
								<FormControl fullWidth variant='outlined' margin='dense'>
									<InputLabel htmlFor='availability'>
										{t('t-availability')}
									</InputLabel>
									<OutlinedInput
										required
										id='availability'
										name='availability'
										type='availability'
										label={t('t-availability')}
										value={formData.availability}
										onChange={handleChange}
									/>
								</FormControl>
								<FormControlLabel
									control={
										<Checkbox
											name='urgent'
											checked={isUrgent}
											onChange={(event) => setIsUrgent(event.target.checked)}
										/>
									}
									label={t('t-urgent')}
									sx={{ display: isGivingHelp ? 'none' : 'block' }}
								/>
								<Button
									type='submit'
									fullWidth
									variant='outlined'
									sx={{ my: 3 }}
								>
									{t('t-submit')}
								</Button>
							</Box>
						</Grid>
						<Grid item xs={12} sm={6} md={6} lg={6}>
							<Button
								component='label'
								variant='text'
								focusRipple
								style={{
									width: '100%',
									height: '100%',
									borderRadius: 1,
									[theme.breakpoints.down('sm')]: {
										width: '100% !important',
										height: 100,
									},
								}}
							>
								<VisuallyHiddenInput
									type='file'
									name='image'
									accept='image/*'
									ref={inputRef}
									onChange={handleThumbnail}
								/>
								<ImageSrc
									style={{
										backgroundImage: `url(${pic1})`,
									}}
								/>
								<ImageBackdrop className='MuiImageBackdrop-root' />
								<Image className='MuiTypo-root'>
									<Typography
										variant='h5'
										color='inherit'
										sx={{
											position: 'relative',
											p: 4,
											pt: 2,
											pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
										}}
									>
										{t('t-upload-pic')}
										<ImageMarked className='MuiImageMarked-root' />
									</Typography>
								</Image>
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Fade>
		</Modal>
	);
}

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	minWidth: '50%',
	minHeight: '50%',
	transform: 'translate(-50%, -50%)',
	borderRadius: 1,
	boxShadow: 24,
	backdropfilter: 'blur(8px)',
};

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
	function Fade(props, ref) {
		const {
			children,
			in: open,
			onClick,
			onEnter,
			onExited,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			ownerState,
			...other
		} = props;
		const style = useSpring({
			from: { opacity: 0 },
			to: { opacity: open ? 1 : 0 },
			onStart: () => {
				if (open && onEnter) {
					onEnter(null as never, true);
				}
			},
			onRest: () => {
				if (!open && onExited) {
					onExited(null as never, true);
				}
			},
		});

		return (
			<animated.div ref={ref} style={style} {...other}>
				{React.cloneElement(children, { onClick })}
			</animated.div>
		);
	}
);

const ImageButton = styled(ButtonBase)(({ theme }) => ({
	position: 'relative',
	minHeight: '50vh',
	borderRadius: 10, //to delete?
	boxShadow: '24px black', //to delete?
	[theme.breakpoints.down('sm')]: {
		width: '100% !important',
		height: 100,
	},
	'&:hover, &.Mui-focusVisible': {
		zIndex: 1,
		'& .MuiImageBackdrop-root': {
			opacity: 0,
		},
		'& .MuiImageMarked-root': {
			opacity: 0,
		},
		'& .MuiTypo-root': {
			border: '4px solid currentColor',
			borderRadius: 5,
			transitionDuration: '0.5s',
		},
	},
}));

const ImageSrc = styled('span')({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundSize: 'cover',
	backgroundPosition: 'center 40%',
	borderRadius: 1,
});

const Image = styled('div')(({ theme }) => ({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 1,
	color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundColor: theme.palette.common.black,
	opacity: 0.4,
	borderRadius: 1,
	transition: theme.transitions.create('opacity'),
	transitionDuration: '1s',
}));

const ImageMarked = styled('span')(({ theme }) => ({
	height: 3,
	width: 18,
	backgroundColor: theme.palette.common.white,
	position: 'absolute',
	bottom: -2,
	left: 'calc(50% - 9px)',
	borderRadius: 1,
	transition: theme.transitions.create('opacity'),
	transitionDuration: '1s',
}));

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});
