import * as React from 'react';
import { AxiosResponse } from 'axios';
import { POST } from '../utils/api';
import {
	Avatar,
	Box,
	Button,
	ButtonBase,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import pic from '../assets/images/goods1.jpg';
import useSnackbar from '../utils/useSnackbar';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Login() {
	interface Token extends AxiosResponse {
		token: string;
	}
	const { t } = useTranslation();
	const { SnackbarProps } = useSnackbar();
	const navigate = useNavigate();
	const theme = useTheme();
	const [email, setEmail] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response: Token = await POST('/auth/login', { email, password });
			console.log('Token:', response);
			localStorage.setItem('USER', JSON.stringify(response));
			console.log('Token saved in localStorage:', localStorage.getItem('USER'));
			if (localStorage.getItem('USER')) {
				SnackbarProps(t('t-login-success'), true);
				setTimeout(async () => {
					navigate('/');
				}, 1000);
			} else {
				SnackbarProps(t('t-login-failed'), false);
			}
		} catch (error) {
			SnackbarProps(t('t-login-failed'), false);
		}
	};

	return (
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
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					{t('t-login')}
				</Typography>
				<Box component='form' noValidate onSubmit={handleLogin}>
					<FormControl fullWidth variant='outlined' margin='normal'>
						<InputLabel
							htmlFor='email'
							error={
								email !== '' &&
								!/^([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i.test(email)
							}
						>
							{t('t-email')}
						</InputLabel>
						<OutlinedInput
							required
							id='email'
							name='email'
							type='email'
							label={t('t-email')}
							error={
								email !== '' &&
								!/^([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i.test(email)
							}
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>
						<FormHelperText error>
							{email !== '' &&
							!/^([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i.test(email)
								? t('t-invalid-email')
								: ''}
						</FormHelperText>
					</FormControl>
					<FormControl fullWidth variant='outlined' margin='normal'>
						<InputLabel htmlFor='password'>{t('t-password')}</InputLabel>
						<OutlinedInput
							required
							id='password'
							name='password'
							type={showPassword ? 'text' : 'password'}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge='end'
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
							label={t('t-password')}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>
					</FormControl>
					<FormControlLabel
						control={<Checkbox value='remember' color='primary' />}
						label='Remember me'
					/>
					<Button
						type='submit'
						fullWidth
						variant='outlined'
						sx={{ my: 3 }}
						disabled={
							email === '' ||
							!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ||
							password === ''
						}
					>
						{t('t-login')}
					</Button>
					<Button variant='text' onClick={() => navigate('/login')}>
						{t('t-forgot-password')}
					</Button>
				</Box>
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				md={6}
				lg={6}
				sx={{
					backgroundImage: `url(${pic})`,
					backgroundSize: 'auto 100%',
					backgroundPositionX: 'center',
				}}
			>
				<Box
					height='100%'
					display='flex'
					flexDirection='column'
					justifyContent='center'
					borderRadius={1}
					bgcolor='rgba(0,0,0,0.5)'
					sx={{
						':hover': { bgcolor: 'rgba(0,0,0,0.7)' },
						transitionDuration: '1s',
					}}
				>
					<IconButton size='large' onClick={() => navigate('/signup')}>
						<HandshakeIcon
							sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
							color='primary'
						/>
						<Typography
							variant='h5'
							display={{ xs: 'none', md: 'flex' }}
							color='primary.light'
							fontFamily='monospace'
							fontWeight={700}
							letterSpacing='.3rem'
							mr={2}
							sx={{
								textDecoration: 'none',
							}}
						>
							{t('t-zelaze')}
						</Typography>
					</IconButton>
					<ButtonBase
						style={{
							fontSize: 20,
							color: 'white',
							fontFamily: 'Karla',
						}}
						onClick={() => navigate('/signup')}
					>
						{t('t-to-signup')}
					</ButtonBase>
				</Box>
			</Grid>
		</Grid>
	);
}
