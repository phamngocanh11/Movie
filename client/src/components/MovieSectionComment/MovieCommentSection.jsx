import React from "react";
import { FaStar, FaComment, FaRegSmileWink } from "react-icons/fa";
import Button from "../UI/Button/Button";
import "./MovieCommentSection.css";

const MovieCommentSection = ({
  rating,
  comment,
  comments,
  handleRatingChange,
  handleCommentChange,
  submitComment,
}) => {
  return (
    <div className="mcs-container movie-section">
      <div className="mcs-section-header">
        <h2 className="mcs-section-title">
          <FaRegSmileWink className="mcs-section-icon" />
          Bình Luận & Đánh Giá
        </h2>
      </div>

      <div className="mcs-form">
        <div className="mcs-rating">
          <label>Đánh giá của bạn:</label>
          <div className="mcs-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`mcs-star ${rating >= star ? "active" : ""}`}
                onClick={() => handleRatingChange(star)}
              />
            ))}
          </div>
        </div>

        <textarea
          placeholder="Chia sẻ ý kiến của bạn về bộ phim này..."
          value={comment}
          onChange={handleCommentChange}
          className="mcs-textarea"
        />

        <div className="mcs-action">
          <Button
            variant="primary"
            onClick={submitComment}
            disabled={!comment.trim()}
            hasIcon={true}
          >
            <FaComment /> Gửi Bình Luận
          </Button>
        </div>
      </div>

      <div className="mcs-comments">
        {comments.length > 0 ? (
          comments.map((item) => (
            <div className="mcs-comment" key={item.id}>
              <div className="mcs-comment-header">
                <div className="mcs-user">
                  <img
                    src={item.avatar}
                    alt={item.user}
                    className="mcs-avatar"
                  />
                  <span className="mcs-username">{item.user}</span>
                </div>

                <div className="mcs-meta">
                  <div className="mcs-comment-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={item.rating >= star ? "active" : ""}
                      />
                    ))}
                  </div>
                  <span className="mcs-date">
                    {new Date(item.date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              <div className="mcs-comment-body">
                <p>{item.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="mcs-empty">
            <p>Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCommentSection;
