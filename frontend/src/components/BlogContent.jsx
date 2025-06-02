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

const Code = ({ code }) => {
  return (
    <pre className="my-6">
      <code className="bg-gray-100 rounded-md p-4 block">{code}</code>
    </pre>
  );
};

const Video = ({ url }) => {
  return (
    <div className="my-6">
      <iframe
        width="100%"
        height="315"
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const Embed = ({ url }) => {
  return (
    <div className="my-6">
      <iframe
        src={url}
        width="100%"
        height="315"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
// link

const Link = ({ url, caption }) => {
  return (
    <div className="my-6 flex items-center gap-3">
      Link:
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-blue-600 hover:underline line-clamp-1 border bg-blue-300 rounded-lg p-3"
      >
        {caption || url}
      </a>
    </div>
  );
};

const Separator = () => {
  return <hr className="my-6 border-gray-200" />;
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

  if (type === 'code') {
    return <Code code={data.code} />;
  }

  if (type === 'embed') {
    return <Video url={data.url} />;
  }

  if (type === 'link') {
    return <Link url={data.link} caption={data.meta?.title || data.link} />;
  }

  return <div className="text-red-500 my-4 font-semibold">Unsupported block type: {type}</div>;
};

export default BlogContent;
