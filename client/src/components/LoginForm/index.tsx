import axios from 'axios';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import { LoginUserSchema } from '../../apiTypes';
import * as styles from '../../pages/Login/style';

export default function LoginForm() {
    const navigate = useNavigate();
    const [isError, setIsError] = React.useState<boolean>(false);
    const [isErrorForm, setIsErrorForm] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const { mutate } = useSWRConfig();
    const intl = useIntl();

    const login = (data: LoginUserSchema) => {
        setIsError(false);
        setIsLoading(true);
        axios
            .post('/api/auth/login', data)
            .then(() => {
                setIsLoading(false);
                mutate('/api/users/me');
                navigate('/');
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
                if (error.response) {
                    setErrorMessage(error.response.data.detail);
                } else {
                    setErrorMessage(error.message);
                }
                setIsError(true);
            });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (email && password) {
            const data: LoginUserSchema = {
                email: email,
                password: password,
            };
            login(data);
        } else {
            setErrorMessage('All fields are required !');
            setIsErrorForm(true);
        }

        if (isErrorForm) {
            return;
        }
    };

    return (
        <styles.FormGlobal onSubmit={handleSubmit}>
            <styles.Category>
                <styles.CategoryTitle>
                    {intl.formatMessage({ id: 'email' })}
                </styles.CategoryTitle>
                <styles.FormInput
                    type="email"
                    placeholder="Email"
                    autoFocus
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </styles.Category>

            <styles.Category>
                <styles.CategoryTitle>
                    {intl.formatMessage({ id: 'password' })}
                </styles.CategoryTitle>
                <styles.FormInput
                    type="password"
                    placeholder="************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && (
                    <styles.ErrorMessage>{errorMessage}</styles.ErrorMessage>
                )}
            </styles.Category>
            <styles.FormSubmit
                type="submit"
                value={intl.formatMessage({ id: 'connexion' })}
                disabled={isLoading}
            />
        </styles.FormGlobal>
    );
}
