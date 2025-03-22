import TextContent from './TextContent/TextContent';
import MediaDisplay from './MediaContent/MediaDisplay';

const PostContent = ({
    content,
    media
}) => {

    return (
        <>
            <TextContent content={content} />
            {/* {media && media.length > 0 && <MediaDisplay media={media} />} */}
        </>
    );
};

export default PostContent;