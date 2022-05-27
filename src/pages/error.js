import React  from "react";
import Layout from "../components/Layout";
import URI from "urijs";
import styles from '../styles/error.module.scss';

const ErrorPage = () => {
    let query = null;
    if (window && typeof window !== "undefined") {
        query = URI.parseQuery(window.location.search);
    }

    let errorTittle = 'Error';

    if(query.error){
        errorTittle = query.error;
    }

    let errorDetails = '';

    if(query.error_description){
        errorDetails = query.error_description;
    }

    return (
        <Layout>
            <div className={styles.wrapper}>
                <h1>{errorTittle}</h1>
                <p>Server returned with an error. Please contact admin.</p>
                { errorDetails &&
                    <details>
                        {errorDetails}
                    </details>
                }
            </div>
        </Layout>
    );
};

export default ErrorPage;
