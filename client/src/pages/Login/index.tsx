import { useState } from 'react';
import { useIntl } from 'react-intl';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';
import * as styles from './style';


export default function Login() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const intl = useIntl();

    return (
        <styles.FullBody>
            <styles.HalfBodyLeft />
            {isLogin ? (
                <styles.HalfBodyCenter>
                    {/* <styles.HomeLogo src={LogoClair} /> */}
                    <styles.Rectangle />
                    <styles.FormTitle>
                        {intl.formatMessage({ id: 'login' })}
                    </styles.FormTitle>
                    <styles.Category>
                        <styles.CategoryTitle>
                            <styles.NavText>
                                {intl.formatMessage({ id: 'noaccount' })}
                                <styles.ButtonSwitch
                                    type="button"
                                    onClick={() => {
                                        setIsLogin((prev) => !prev);
                                    }}
                                >
                                    {intl.formatMessage({ id: 'registerhere' })}
                                </styles.ButtonSwitch>
                            </styles.NavText>
                        </styles.CategoryTitle>
                    </styles.Category>

                    <styles.FormBox>
                        <LoginForm />
                    </styles.FormBox>
                </styles.HalfBodyCenter>
            ) : (
                <styles.HalfBodyCenter>
                    {/* <styles.HomeLogo src={LogoClair} /> */}
                    <styles.Rectangle />
                    <styles.FormTitle>
                        {intl.formatMessage({ id: 'register' })}
                    </styles.FormTitle>
                    <styles.Category>
                        <styles.CategoryTitle>
                            <styles.NavText>
                                {intl.formatMessage({ id: 'account' })}
                                <styles.ButtonSwitch
                                    type="button"
                                    onClick={() => {
                                        setIsLogin((prev) => !prev);
                                    }}
                                >
                                    {intl.formatMessage({ id: 'loginhere' })}
                                </styles.ButtonSwitch>
                            </styles.NavText>
                        </styles.CategoryTitle>
                    </styles.Category>

                    <styles.FormBox>
                        <RegisterForm />
                    </styles.FormBox>
                </styles.HalfBodyCenter>
            )}
            <styles.HalfBodyRight />
        </styles.FullBody>
    );
}
