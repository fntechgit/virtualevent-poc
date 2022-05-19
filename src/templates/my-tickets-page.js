import React from "react";
import { connect } from "react-redux";
import { MyOrdersTickets } from '../components/MyOrdersTicketsComponent';

const MyTicketsPage = ({ }) => {
    return (
        <MyOrdersTickets />
    );
};

const mapStateToProps = ({ userState }) => ({
    userProfile: userState.userProfile
});

export default connect(mapStateToProps, {})(MyTicketsPage);