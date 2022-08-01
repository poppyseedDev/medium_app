export default {
    name: 'comment',
    type: 'document',
    title: "Comment",
    fields: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'approved',
        title: 'Approved',
        type: 'boolean',
        description: "Comments won't show on the site without approval",
      },
      {
        name: 'email',
        type: 'string',
      },
      {
        name: 'comment',
        type: 'string',
      },
      {
        name: 'post',
        type: 'reference',
        to: [{ type: "post"}]
      },
    ],
  };