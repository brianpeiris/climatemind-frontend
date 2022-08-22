import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';
import { loginResponse, postLogin } from '../../api/postLogin';
import { postLogout } from '../../api/postLogout';
import { refreshResponse } from '../../api/postRefresh';
import ROUTES from '../../components/Router/RouteConfig';
import { AuthContext, AuthDispatch, emptyUser } from '../../contexts/auth';
import { TAuth } from '../../types/Auth';
import { useSession } from '../useSession';
import { useToast } from '../useToast';
import { useRefresh } from './useRefresh';
import { climateApi } from '../../api/apiHelper';
import { TLocation } from '../../types/Location';
import { useErrorLogging } from '../useErrorLogging';

interface userLogin {
  email: string;
  password: string;
  recaptchaToken: string;
}

export function useAuth() {
  const auth = useContext(AuthContext);
  const setAuth = useContext(AuthDispatch);
  const { showToast } = useToast();
  const { push } = useHistory();
  const { clearSession, setQuizId } = useSession();
  const { fetchRefreshToken } = useRefresh();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { logError, logMessage } = useErrorLogging();

  const { isLoggedIn, accessToken } = auth;
  const location = useLocation<TLocation>();

  // Call refresh on load on load to see if the user has a valid refresh token
  useEffect(() => {
    const refreshToken = async () => {
      // if not logged in call refresh token
      if (!isLoggedIn && !accessToken) {
        // See if we can refresh the token token
        try {
          const response = await fetchRefreshToken();
          setUserFromResponse(response);
          setQuizId(response.user.quiz_id);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setIsError(true);
        }
      }
      // Refresh the token every 14.5minutes
    };
    refreshToken();

    const timer = setInterval(async () => {
      const response = await fetchRefreshToken();
      setAccessToken(response.access_token);
    }, 870000); // 14mins 30seconds 870000

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, []);

  // Add access token to all requests
  useEffect(() => {
    accessToken &&
      climateApi.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config;
      });
  }, [accessToken]);

  const mutateLogin = useMutation(
    (loginCreds: userLogin) => postLogin(loginCreds),
    {
      onError: (error: any) => {
        showToast({
          message:
            error.response?.data?.error ||
            'The email and password entered don’t match. Please try again.',
          type: 'error',
        });
        logError(error);
      },
      onSuccess: async (response: loginResponse) => {
        // Show notifications
        showToast({
          message: `Welcome back, ${response.user.first_name}!`,
          type: 'success',
        });

        // Set the login state
        const user = {
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          email: response.user.email,
          userIntials: response.user.first_name[0] + response.user.last_name[0],
          accessToken: response.access_token,
          userId: response.user.user_uuid,
          isLoggedIn: true,
          quizId: response.user.quiz_id,
        };
        setUserContext(user);

        if (response.user.quiz_id) {
          setQuizId(response.user.quiz_id);
        } else {
          showToast({
            message: 'Error no session id',
            type: 'error',
          });
          logMessage('Error no session id');
        }

        if (location.state?.from) {
          push(location.state.from);
        } else {
          // Redirect the user to the climate feed
          push(ROUTES.ROUTE_FEED);
        }
      },
    }
  );

  const mutateLogout = useMutation(() => postLogout(), {
    onError: (error) => {
      showToast({
        message: 'Error logging out',
        type: 'error',
      });
      logError(error);
    },
    onSuccess: async () => {
      // Show notifications
      showToast({
        message: `Goodbye!`,
        type: 'success',
      });
      push(ROUTES.ROUTE_HOME);
    },
  });

  // Take the api response from login/register/refresh and set the user
  const setUserFromResponse = (response: refreshResponse) => {
    const currentUser = {
      firstName: response.user.first_name,
      lastName: response.user.last_name,
      email: response.user.email,
      userIntials: response.user.first_name[0] + response.user.last_name[0],
      accessToken: response.access_token,
      userId: response.user.user_uuid,
      isLoggedIn: true,
      quizId: response.user.quiz_id,
    };
    setUserContext(currentUser);
  };

  const setUserContext = (user: TAuth) => {
    if (setAuth) {
      setAuth(user);
    }
  };

  const setAccessToken = (accessToken: string) => {
    if (setAuth) {
      setAuth((prevState) => {
        return {
          ...prevState,
          accessToken,
        };
      });
    }
  };

  const logout = async () => {
    // Clear out user details from state
    if (setAuth) {
      setAuth(emptyUser);
    }
    clearSession();
    // Unset the refresh token cookie.
    await mutateLogout.mutateAsync();
  };

  const login = async ({ email, password, recaptchaToken }: userLogin) => {
    // Call the api
    await mutateLogin.mutateAsync({
      recaptchaToken,
      email,
      password,
    });
  };

  return {
    auth,
    accessToken,
    setUserContext,
    setUserFromResponse,
    login,
    logout,
    isLoggedIn,
    isLoading,
    isError,
  };
}
