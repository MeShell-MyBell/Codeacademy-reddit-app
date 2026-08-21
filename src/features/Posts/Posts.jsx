import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectPosts,
  selectIsLoading,
  loadPosts,
} from './PostsSlice';
import { Link, useParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Posts.css';
import { formatTimestamp } from '../../helpers/helpers';
import ReactMarkdown from 'react-markdown';

import {loadComments} from '../Comments/CommentsSlice'
import { FaComments } from 'react-icons/fa';


function Posts() {
  const posts = useSelector(selectPosts);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  const { name } = useParams();

  useEffect(() => {
    dispatch(loadPosts(name));

    window.scrollTo(0, 0);
  }, [dispatch, name]);

  const carrusel = posts.map((post) => {
    return post.media_metadata || null;
  });

  let values = [];

  const carruselValues = carrusel.map((post) => {
    if (post) {
      values = Object.values(post);
      return values;
    }
  
    return null;
  });


  
    
  

  return (
    <SkeletonTheme baseColor="" highlightColor="#00000026">
      <div className="container container-post">
        {posts.map((post, id) => {
          return (
            <div
              className="row rows mx-auto px-3 py-2 border-top rounded my-4"
              key={id}
            >
              <div className="col mt-4">
                <div className="card mb-3">
                  <div className="card-body pt-2">
                    <div className="row">
                      {isLoading ? (
                        <Skeleton width={100} />
                      ) : (
                        <div className="col mb-2">
                          <Link to={post.subreddit} className=" link-subreddit">
                            <small className="text-muted link-small">
                              {post.subreddit}
                            </small>
                          </Link>
                        </div>
                      )}
                    </div>

                    <h4 className="card-title mt-2">
                      {!isLoading ? (
                        <ReactMarkdown className="">{post.title}</ReactMarkdown>
                      ) : (
                        <Skeleton height={40} className="pb-0" />
                      )}
                    </h4>

                    {isLoading ? (
                      <Skeleton className="mt-0" />
                    ) : (
                      <ReactMarkdown className="mt-3 markdown" target="_blank">
                        {post.selftext}
                      </ReactMarkdown>
                    )}

                    {/* Carousel */}
                    {!isLoading && carruselValues[id] && (
                      <div
                        id={id}
                        className="carousel slide"
                        data-ride="carousel"
                      >
                        <div className="carousel-inner">
                          {carruselValues[id].map((imgValue, index) => {
                            if (index === 0) {
                              return (
                                <div
                                  className="carousel-item post-image-container active"
                                  key={imgValue.id}
                                >
                                  <img
                                    className="post-image"
                                    src={
                                      (imgValue.status === 'valid' &&
                                        imgValue.s &&
                                        imgValue.s.u &&
                                        imgValue.s.u.replaceAll('amp;', '')) ||
                                      'https://i.redd.it/124u26yg91q41.jpg'
                                    }
                                    alt={id}
                                  />
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  className="carousel-item post-image-container"
                                  key={imgValue.id}
                                >
                                  <img
                                    className="post-image"
                                    src={
                                      (imgValue.status === 'valid' &&
                                        imgValue.s &&
                                        imgValue.s.u &&
                                        imgValue.s.u.replaceAll('amp;', '')) ||
                                      'https://i.redd.it/124u26yg91q41.jpg'
                                    }
                                    alt={id}
                                  />
                                </div>
                              );
                            }
                          })}
                        </div>
                        <a
                          className="carousel-control-prev"
                          href={`#${id}`}
                          role="button"
                          data-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Previous</span>
                        </a>
                        <a
                          className="carousel-control-next"
                          href={`#${id}`}
                          role="button"
                          data-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Next</span>
                        </a>
                      </div>
                    )}

                    {/* Video */}
                    {!isLoading &&
                      post.secure_media &&
                      post.secure_media.reddit_video && (
                        <div className="post-image-container mt-3 d-flex justify-content-center ">
                          <video controls className="post-video">
                            <source
                              src={post.media.reddit_video.fallback_url}
                              type="video/webm"
                            />
                            Sorry, your browser doesn't support embedded videos.
                          </video>
                        </div>
                      )}

                    {/* Image */}
                    {post.url && (
                      <div className="post-image-container mt-3 d-flex justify-content-center ">
                        {isLoading ? (
                          <Skeleton
                            width={700}
                            height={300}
                            className=" rounded pt-0"
                          />
                        ) : (
                          <img src={post.url} alt="" className="post-image" />
                        )}
                      </div>
                    )}

                    {isLoading ? (
                      <Skeleton className="mt-2" />
                    ) : (
                      <div className="row">
                        <div className="col mb-2">
                          {post.url_overridden_by_dest &&
                            !post.url_overridden_by_dest.includes('gif') &&
                            !post.url_overridden_by_dest.includes('png') &&
                            !post.url_overridden_by_dest.includes('jpg') &&
                            !post.url_overridden_by_dest.includes('redd') && (
                              <a
                              href={post.url_overridden_by_dest}
                              className="links"
                              target="_blank"
                              rel="noreferrer"
                            >
                              >
                                <small className="text-muted links">
                                  {post.url_overridden_by_dest}
                                </small>
                              </a>
                            )}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="d-flex justify-content-between mt-2 flex-wrap-reverse div-posted">
                        <Link to="/comments">
                        <button
                          className="btn btn-primary btn-comments"
                          type="button"
                          data-toggle=""
                          data-target={`#${post.id}`}
                          aria-expanded="false"
                          aria-controls="collapseExample"
                          onClick={() => {
                            dispatch(loadComments(post.permalink))
                            window.scrollTo(0, 0);;
                          }}
                        >
                        <span className='num-comments'><FaComments /> </span> {!isLoading && post.num_comments} Comments  
                        </button>
                        </Link>
                        {isLoading ? (
                          <Skeleton className="mt-2" width={280} />
                        ) : (
                          <p className="card-text mt-2 d-inline mr-2 posted">
                            <small className="text-muted">
                              {`Posted by `}{' '}
                              <span className="author" href="">
                                {post.author}
                              </span>{' '}
                              {`${formatTimestamp(post.created)}`}
                            </small>
                          </p>
                        )}
                      </div>
                      
                        
                          
                        
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SkeletonTheme>
  );
}

export default Posts;
