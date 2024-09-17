export const Root = () => {
    return (
        <div
            style={{
                backgroundColor: "#1e2028",
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "row"
            }}
        >
            <div id="header" style={{
                backgroundColor: "#26293a",
                width: "100%",
                height: "80px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}>
                <p style={{
                    marginLeft: "10px",
                    color: "white",
                    fontFamily: "Inter",
                    fontSize: "32px",
                    fontWeight: "bold"
                }}>Todo Website</p>
            </div>
        </div>
    );
};
