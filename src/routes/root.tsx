import "./root.css";

export const Root = () => {
    return (
        <div id="background">
            <div id="header">
                <div id="header-text">
                    Todo Website
                </div>
            </div>

            <div id="left-sidebar">
                <button id="all-tasks-button" className="tasks-button">All Tasks</button>

                <button id="ungrouped-tasks-button" className="tasks-button">Ungrouped Tasks</button>
            </div>
        </div>
    );
};
