import { Form, useLoaderData } from '@remix-run/react';
import type { ActionFunctionArgs, MetaFunction } from '@vercel/remix';
import db from '~/db';
import { expenses } from '~/db/schema';

export const meta: MetaFunction = () => {
	return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export async function loader() {
	return db.select().from(expenses);
}

export async function action({ request }: ActionFunctionArgs) {
	const form = await request.formData();

	const description = String(form.get('description') ?? '');
	const amount = Number(form.get('amount') ?? 0);

	await db
		.insert(expenses)
		.values({ description, amount: String(amount) })
		.execute();

	return null;
}

export default function Index() {
	const expenses = useLoaderData<typeof loader>();

	return (
		<div>
			<div>{JSON.stringify(expenses, null, 2)}</div>
			<Form method='post'>
				<input type='text' name='description' placeholder='Description' />
				<input type='number' required name='amount' placeholder='Amount' />
				<button>Submit</button>
			</Form>
		</div>
	);
}
