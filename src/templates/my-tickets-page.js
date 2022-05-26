import React from "react";
import { connect } from "react-redux";
import Layout from "../components/Layout";
import { MyOrdersTicketsComponent } from '../components/MyOrdersTicketsComponent';

const MyTicketsPage = ({ location, user, isLoggedUser }) => {
    // console.log(user);

    return (
        <Layout location={location}>
            <div className="container">
                <MyOrdersTicketsComponent />
            </div>
        </Layout>
    );
};

const mapStateToProps = ({ userState }) => ({
    user: userState,
});

export default connect(mapStateToProps, {})(MyTicketsPage);