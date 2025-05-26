const Img = ({ url, caption }) => {
  return (
    <div className="my-6">
      <img src={url} alt={caption || 'image'} className="w-full rounded-xl shadow-md" />
      {caption?.length > 0 && (
        <p className="w-full text-center mt-3 text-sm italic text-gray-500">{caption}</p>
      )}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-purple-100/50 border-l-4 border-purple-600 px-6 py-4 my-6 rounded-md shadow-sm">
      <p className="text-lg italic text-gray-800 leading-relaxed">“{quote}”</p>
      {caption?.length > 0 && (
        <p className="mt-3 text-right text-sm text-gray-600 italic">— {caption}</p>
      )}
    </div>
  );
};

const List = ({ style, items }) => {
  const ListTag = style === 'ordered' ? 'ol' : 'ul';

  return (
    <ListTag
      className={`pl-6 my-4 space-y-2 ${style === 'ordered' ? 'list-decimal' : 'list-disc'}`}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className="text-lg text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      ))}
    </ListTag>
  );
};

const BlogContent = ({ block }) => {
  const { type, data } = block;

  if (type === 'paragraph') {
    return (
      <p
        className="text-lg leading-relaxed my-4 text-gray-800"
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
    );
  }

  if (type === 'header') {
    if (data.level === 1) {
      return (
        <h1
          className="text-4xl font-bold my-6 text-gray-900"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      );
    }
    if (data.level === 2) {
      return (
        <h2
          className="text-3xl font-bold my-6 text-gray-900"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      );
    }
    if (data.level === 3) {
      return (
        <h3
          className="text-2xl font-bold my-6 text-gray-900"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      );
    }
    if (data.level === 4) {
      return (
        <h4
          className="text-xl font-bold my-6 text-gray-900"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      );
    }
    if (data.level === 5) {
      return (
        <h5
          className="text-lg font-bold my-6 text-gray-900"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      );
    }
    if (data.level === 6) {
      return (
        <h6
          className="text-base font-bold my-6 text-gray-900"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      );
    }
  }

  if (type === 'image') {
    return <Img url={data.file.url} caption={data.caption} />;
  }

  if (type === 'quote') {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  if (type === 'list') {
    return <List style={data.style} items={data.items} />;
  }

  return <div className="text-red-500 my-4 font-semibold">Unsupported block type: {type}</div>;
};

export default BlogContent;
