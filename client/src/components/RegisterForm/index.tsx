import axios from 'axios';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import { CreateUserSchema, LoginUserSchema } from '../../apiTypes';
import * as styles from '../../pages/Login/style';

export default function RegisterForm() {
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const [isError, setIsError] = React.useState<boolean>(false);
    const [isErrorForm, setIsErrorForm] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [firstName, setFirstName] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = React.useState<string>('');

    const intl = useIntl();

    const register = async (data: CreateUserSchema) => {
        setIsError(false);
        setIsLoading(true);
        axios
            .post('/api/auth/register', data)
            .then(() => {
                const dataLogin: LoginUserSchema = {
                    email: data.email,
                    password: data.password,
                };
                axios
                    .post('/api/auth/login', dataLogin)
                    .then(() => {
                        setIsLoading(false);
                        mutate('/api/users/me');
                        navigate('/');
                    })
                    .catch((e) => console.log(e));
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

        if (
            firstName &&
            email &&
            password.length > 7 &&
            passwordConfirm &&
            password === passwordConfirm
        ) {
            const data: CreateUserSchema = {
                name: firstName,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm,
            };
            register(data);
        } else {
            if (password !== passwordConfirm) {
                setErrorMessage(() =>
                    intl.formatMessage({ id: 'passwordsNotMatching' })
                );
            } else if (password.length < 8) {
                setErrorMessage(() =>
                    intl.formatMessage({ id: 'passwordEightChar' })
                );
            } else {
                setErrorMessage(() => intl.formatMessage({ id: 'allFields' }));
            }
            setIsErrorForm(true);
        }

        if (isErrorForm) {
            return;
        }
    };

    return (
        <>
            <styles.FormGlobal onSubmit={handleSubmit}>
                <styles.Category>
                    <styles.CategoryTitle>
                        {intl.formatMessage({ id: 'name' })}
                    </styles.CategoryTitle>
                    <styles.FormInput
                        type="text"
                        placeholder="Your first name"
                        disabled={isLoading}
                        value={firstName}
                        autoFocus
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </styles.Category>

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
                </styles.Category>

                <styles.Category>
                    <styles.CategoryTitle>
                        {intl.formatMessage({ id: 'confirm' })}
                    </styles.CategoryTitle>
                    <styles.FormInput
                        type="password"
                        placeholder="************"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                </styles.Category>

                <styles.FormSubmit
                    type="submit"
                    value={intl.formatMessage({ id: 'signup' })}
                    disabled={isLoading}
                />
            </styles.FormGlobal>
            {errorMessage && (
                <styles.ErrorMessage>{errorMessage}</styles.ErrorMessage>
            )}
        </>
    );
}
