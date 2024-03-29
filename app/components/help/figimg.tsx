export const FigImg = ({ imgSrc, imgAlt, figcaption }: { imgSrc: string, imgAlt: string, figcaption: string }): JSX.Element => (<figure>
	<img src={`/images/${imgSrc}`} alt={imgAlt} />
	<figcaption>{figcaption}</figcaption>
</figure>);
