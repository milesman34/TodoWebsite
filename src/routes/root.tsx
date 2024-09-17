import { inter } from "../styles/classes";
import { backgroundColor, headerColor } from "../styles/colors";

export const Root = () => {
    return (
        <div
            id="background"
            style={{
                backgroundColor: backgroundColor,
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "row"
            }}
        >
            <div
                id="header"
                style={{
                    backgroundColor: headerColor,
                    width: "100%",
                    height: "80px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}
            >
                <div
                    id="header-text"
                    style={{
                        marginLeft: "10px",
                        color: "white",
                        fontSize: "32px",
                        fontWeight: "bold",
                        ...inter
                    }}
                >
                    Todo Website
                </div>
            </div>
        </div>
    );
};
