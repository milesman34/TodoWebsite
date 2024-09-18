import { CSSProperties } from "react";
import { inter } from "../styles/classes";
import { backgroundColor, headerColor } from "../styles/colors";

const backgroundStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "row"
};

const headerStyle: CSSProperties = {
    backgroundColor: headerColor,
    width: "100%",
    height: "80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
};

const headerTextStyle: CSSProperties = {
    marginLeft: "10px",
    color: "white",
    fontSize: "32px",
    fontWeight: "bold",
    ...inter
};

export const Root = () => {
    return (
        <div id="background" style={backgroundStyle}>
            <div id="header" style={headerStyle}>
                <div id="header-text" style={headerTextStyle}>
                    Todo Website
                </div>
            </div>
        </div>
    );
};
