import type { IUser } from "../../models/accounts/userSchemaModel";
import { CompleteHeader } from "../sharedComponents/header";
import { SectionDiv } from "../help/sectionDiv";

export default function Help({ user }: { user: IUser }): JSX.Element {
	return (<>
		<CompleteHeader user={user} />
		<div>
			<h1>Aide</h1>
		</div>
		<main>
			<section>
				<SectionDiv id="intro"
					isIntro={true}
					sectionTitle="Bienvenue sur le site"
					level={2}>
					<p>Sur cette page vous trouverez toutes les informations necéssaires pour votre utilisation.</p>
				</SectionDiv>
			</section>
		</main>
	</>);
}
