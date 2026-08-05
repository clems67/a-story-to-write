import { InferenceClient } from '@huggingface/inference';
import { json } from '@sveltejs/kit';
import questions from '$lib/text/questions.json';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	/**
	 * Returns the option id that best matches user input
	 */
	const { user_text, question_id } = await request.json();

	const question = questions.find((x) => x.id == question_id);

	const options = question?.options.map((x, index) => ({
		option: x.input,
		index: index + 1
	}));

	const optionsWithNone = [{ option: 'None', index: 0 }, ...(options ?? [])];

	const prompt = setupPrompt(user_text, JSON.stringify(optionsWithNone));

	const client = new InferenceClient(env.HF_TOKEN);

	const chatCompletion = await client.chatCompletion({
		model: 'Qwen/Qwen3-4B-Instruct-2507:cheapest',
		messages: [
			{
				role: 'user',
				content: prompt
			}
		]
	});

	return json(chatCompletion.choices[0].message);
};

function setupPrompt(user_text: string, options: string) {
	return `
Tu es un classificateur de texte.

Ta tâche est de choisir l'option dont la description correspond le mieux au texte fourni.

Règles :

* Compare l'intention de l'utilisateur avec l'action décrite dans chaque option.
* Ne te base pas uniquement sur les mots en commun, mais sur le sens global de la phrase.
* Choisis une seule option.
* Ta réponse doit être uniquement l'identifiant numérique \`id\` de l'option choisie.
* Si aucune option ne correspond clairement, tu répondras donc par l'\`id\` : 0.
* N'ajoute aucun autre texte, aucune explication, aucun formatage.

Texte utilisateur :

\`\`\`
${user_text}
\`\`\`

Options :

\`\`\`json
${options}
\`\`\`

Réponse :

`;
}
