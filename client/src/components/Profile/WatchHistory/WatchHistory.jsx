import React from "react";
import { Link } from "react-router-dom";
import {
  FaHistory,
  FaEye,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import Moment from 'react-moment';
import "./WatchHistory.css";
import Button from "../../UI/Button/Button";

const WatchHistory = ({ watchHistory = [], cssNamespace = "wh", loading = false }) => {
  const classWithPrefix = (className) => `${cssNamespace}-${className}`;

  return (
    <div className={classWithPrefix("container")}>
      <div className={classWithPrefix("section")}>
        <h3 className={classWithPrefix("section-title")}>
          <FaHistory className={classWithPrefix("section-icon")} />
          Lịch sử xem
        </h3>

        {loading ? (
          <div className={classWithPrefix("empty-content")}>
            <p className={classWithPrefix("empty-text")}>Đang tải lịch sử xem...</p>
          </div>
        ) : watchHistory.length > 0 ? (
          <div className={classWithPrefix("list")}>
            {watchHistory.map((item, index) => (
              <div
                key={item._id || index}
                className={classWithPrefix("item")}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={classWithPrefix("thumbnail")}>
                  <img src={item.thumb_url} alt={item.name} />
                  <div className={classWithPrefix("progress")}>
                    <div
                      className={classWithPrefix("progress-fill")}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className={classWithPrefix("content")}>
                  <h4 className={classWithPrefix("title")}>{item.name}</h4>
                  <div className={classWithPrefix("meta")}>
                    <span className={classWithPrefix("meta-item")}>
                      <FaClock className={classWithPrefix("meta-icon")} />
                      {item.lastWatched}
                    </span>
                    <span className={classWithPrefix("meta-item")}>
                      <FaCheckCircle className={classWithPrefix("meta-icon")} />
                      {item.progress}% hoàn thành
                    </span>
                  </div>
                </div>

                <div className={classWithPrefix("actions")}>
                  <Link
                    to={`/movie/${item.slug}`}
                    className={classWithPrefix("continue-link")}
                  >
                    <Button variant="secondary" size="small" hasIcon={true}>
                      <span>Tiếp tục xem</span>
                      <FaArrowRight />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={classWithPrefix("empty-content")}>
            <div className={classWithPrefix("empty-icon")}>
              <FaEye />
            </div>
            <p className={classWithPrefix("empty-text")}>
              Bạn chưa xem phim nào gần đây
            </p>
            <Link to="/" className={classWithPrefix("discover-link")}>
              <Button variant="primary" hasIcon={true}>
                <span>Khám phá phim ngay</span>
                <FaArrowRight />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
