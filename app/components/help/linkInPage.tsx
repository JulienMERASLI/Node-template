import { FC, useContext } from "react";
import { Link } from "remix";
import { UrlHashContext } from "./sectionDiv";

export const LinkInPage: FC<{ href: string }> = ({ href, children }) => {
	const changeHash = useContext(UrlHashContext)[2];
	return <Link to={`#${href}`} onClick={() => changeHash(`#${href}`)}>{children}</Link>;
};
