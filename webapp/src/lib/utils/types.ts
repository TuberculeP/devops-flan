export interface Foo {
	id: number;
	bar: string;
}

export type Note = {
	frequency: number;
	key: string;
	color: string;
	scale: string;
};

export type User = {
	id: string;
	email: string;
	password?: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	role: string;
	createdAt: Date;
	products: Product[];
	comments: Comment[];
};

export type Comment = {
	id: string;
	user: User;
	product: Product;
	text: string;
	createdAt: Date;
	updatedAt: Date;
};

export type Product = {
	id: string;
	user: User;
	comments: Comment[];
	title: string;
	image: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
};
