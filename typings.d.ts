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