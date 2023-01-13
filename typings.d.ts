export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    slug: {
        _type: string;
        current: string;
    };
    author: {
        name: string;
        image: {
            _type: string;
            asset: {
                _type: string;
                _ref: string;
            };
        };
    };
    comments: Comment[];
    description: string;
    mainImage: {
        _type: string;
        asset: {
            _type: string;
            _ref: string;
        };
    };
    slug: {
        _type: string;
        current: string;
    };
    body: [object];
}

export interface Comment {
    approved: boolean;
    comment: string;
    email: string;
    name: string;
    post: {
        _ref: string;
        _type: string;
    };
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    updatedAt: string;
}