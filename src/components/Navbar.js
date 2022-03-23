import React, { useState } from "react";
import { connect } from "react-redux";
import { StaticQuery, graphql } from "gatsby"
import LogoutButton from "./LogoutButton";
import Link from "./Link";
import ProfilePopupComponent from "./ProfilePopupComponent";
import { updateProfilePicture, updateProfile } from "../actions/user-actions";
import { getEnvVariable, AUTHORIZED_DEFAULT_PATH } from "../utils/envVariables";
import Content from "../content/navbar.json";
import { PHASES } from "../utils/phasesUtils";

import styles from "../styles/navbar.module.scss";
const PAGE_RESTRICTION_ACTIVITY = 'ACTIVITY';
const PAGE_RESTRICTION_MARKETING = 'MARKETING';
const PAGE_RESTRICTION_LOBBY = 'LOBBY';
const PAGE_RESTRICTION_ANY = 'ANY';
const PAGE_RESTRICTION_SHOW = 'SHOW';
const PAGE_RESTRICTION_CUSTOM_PAGE = 'CUSTOM_PAGE';

const Navbar = ({
  isLoggedUser,
  idpProfile,
  idpLoading,
  summit,
  updateProfilePicture,
  updateProfile,
  location,
  summit_phase,
}) => {
  const [active, setActive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleHamburger = () => {
    // toggle the active boolean in the state
    setActive(!active);
  };

  const handleTogglePopup = () => {
    if (showProfile) {
      document.body.classList.remove("is-clipped");
    } else {
      document.body.classList.add("is-clipped");
    }
    setShowProfile(!showProfile);
  };

  const isCustomPage = (path) => {
    return !isMarketingPage(path) &&
           !isShowPage(path) &&
           !isProfilePage(path) &&
           !isMySchedulePage(path) &&
           !isExtraQuestionsPage(path);
  }

  const isMySchedulePage = (path) => {
    return path.startsWith("/a/my-schedule");
  }

  const isProfilePage = (path) => {
    return path.startsWith("/a/profile");
  }

  const isExtraQuestionsPage = (path) => {
    return path.startsWith("/a/extra-questions");
  }

  const isMarketingPage = (path) => {
      return path === '/';
  }

  const isLobbyPage = (path) => {
    return path === '/a' || path === '/a/';
  }

  const isActivityPage = (path) => {
    return path.startsWith("/a/event");
  }

  const isSponsorPage = (path) => {
    return path.startsWith("/a/sponsor");
  }

  const isSchedulePage = (path) => {
    return path.startsWith("/a/schedule");
  }

  const isShowPage = (path) => {
    return isLobbyPage(path) || // lobby
        isActivityPage(path) || // activity
        isSponsorPage(path) || // expo hall or sponsor page
        isSchedulePage(path);// schedule
  }

  // we assume that all pages under /a/* requires auth except /a/schedule
  // item.requiresAuth allows to mark specific pages that are not under /a/* pattern.
  const showItem = (item) => {
    // check if we have location defined, if so use the path name , else if window is defined use the window.location
    // as a fallback
    const currentPath = location ? location.pathname: (typeof window !== "undefined" ? window.location.pathname: "");
    const passPageRestriction = !item.pageRestriction ||
        item.link === currentPath || // if we are on the same page then show it
        item.pageRestriction.includes(PAGE_RESTRICTION_ANY) ||
        (item.pageRestriction.includes(PAGE_RESTRICTION_ACTIVITY) && isActivityPage(currentPath)) ||
        (item.pageRestriction.includes(PAGE_RESTRICTION_MARKETING) && isMarketingPage(currentPath)) ||
        (item.pageRestriction.includes(PAGE_RESTRICTION_LOBBY) && isLobbyPage(currentPath)) ||
        (item.pageRestriction.includes(PAGE_RESTRICTION_SHOW) && isShowPage(currentPath)) ||
        (item.pageRestriction.includes(PAGE_RESTRICTION_CUSTOM_PAGE) && isCustomPage(currentPath))
    ;

    return item.display &&
           (!item.requiresAuth || isLoggedUser) &&
           (!item.showOnlyAtShowTime || summit_phase >= PHASES.DURING) &&
           passPageRestriction;
  };

  const defaultPath = getEnvVariable(AUTHORIZED_DEFAULT_PATH)
    ? getEnvVariable(AUTHORIZED_DEFAULT_PATH)
    : "/a/";
  const navBarActiveClass = active ? styles.isActive : "";

  return (
    <StaticQuery
      query={graphql`
          query HeaderQuery {
            summit {
              logo
            }
          }
        `}
      render={data => {
        const logo = summit && summit.logo ?
          summit.logo
          :
          data.summit && data.summit.logo ?
            data.summit.logo
            :
            null;
        return (
          <header className={`${styles.navbar}`}>
            <div className={styles.navbarBrand}>
              <Link
                to={isLoggedUser ? defaultPath : "/"}
                className={styles.navbarItem}
              >
                {logo && <img src={logo} alt={summit.name} />}
              </Link>
    
              <button
                className={`link ${styles.navbarBurger} ${styles.burger} ${navBarActiveClass}`}
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={() => toggleHamburger()}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </button>
            </div>
    
            <nav
              id="navbarBasicExample"
              className={`${styles.navbarMenu} ${navBarActiveClass}`}
              aria-label="Main"
            >
              <div className={styles.navbarStart} />
              <div className={styles.navbarEnd}>
                {Content.items.filter(showItem).map((item, index) => (
                  <div className={styles.navbarItem} key={index}>
                    <Link to={item.link} className={styles.link}>
                      <span>{item.title}</span>
                    </Link>
                  </div>
                ))}
                {isLoggedUser && (
                  <div className={styles.navbarItem}>
                    <button className="link" onClick={() => handleTogglePopup()}>
                      <img
                        alt="profile pic"
                        className={styles.profilePic}
                        src={idpProfile?.picture}
                      />
                    </button>
                    {showProfile && (
                      <ProfilePopupComponent
                        userProfile={idpProfile}
                        showProfile={showProfile}
                        idpLoading={idpLoading}
                        changePicture={updateProfilePicture}
                        changeProfile={updateProfile}
                        closePopup={() => handleTogglePopup()}
                      />
                    )}
                  </div>
                )}
                <LogoutButton styles={styles} isLoggedUser={isLoggedUser} />
              </div>
            </nav>
          </header>
        )
      }}
    />
  );
};

const mapStateToProps = ({ loggedUserState, summitState, userState, clockState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  idpProfile: userState.idpProfile,
  idpLoading: userState.loadingIDP,
  summit: summitState.summit,
  summit_phase: clockState.summit_phase,
});

export default connect(mapStateToProps, {
  updateProfilePicture,
  updateProfile,
})(Navbar);
