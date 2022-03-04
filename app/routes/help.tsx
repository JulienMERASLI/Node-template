import { useState, useCallback } from "react";
import { LinksFunction, useLocation, useOutletContext } from "remix";
import { OutletContext } from "remix.env";
import { CompleteHeader } from "~/components/header";
import { UrlHashContext, SectionDiv } from "~/components/help/sectionDiv";
import styles from "~/styles/help.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function () {
	const location = useLocation();
	const { user } = useOutletContext<OutletContext>();
	const [hash, setHash] = useState(location.hash);
	const [, updateState] = useState({});
	const forceUpdate = useCallback(() => updateState({}), []);

	function changeHash(newHash: string) {
		setHash(newHash);
		forceUpdate();
	}
	return (<>
		<CompleteHeader user={user} showHelp={false} />
		<div>
			<h1>Aide</h1>
		</div>
		<main>
			<UrlHashContext.Provider value={[hash, setHash, changeHash]}>
				<section>
					<SectionDiv id="intro"
						isIntro={true}
						sectionTitle="Bienvenue sur le site"
						level={2}>
						<p>Sur cette page vous trouverez toutes les informations necéssaires pour votre utilisation.</p>
					</SectionDiv>
				</section>
				<section>
					<p>Pour toute autre aide non disponible sur cette page, ou si vous rencontrez un problème, n'hésitez pas à me contacter !</p>
				</section>
			</UrlHashContext.Provider>
		</main>
	</>);
}
