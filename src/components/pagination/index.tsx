import React, { useState } from 'react';
import styles from './style.module.css';

interface PaginationProps {
  count: number;
  handlePageChange: any;
  currentPage :number;
  itemsPerPage : number
}

const Pagination: React.FC<PaginationProps> = ({ count, handlePageChange, currentPage, itemsPerPage }) => {
  const totalPages = Math?.ceil(count / itemsPerPage) || 1;

  if(currentPage  > totalPages){
    currentPage = totalPages
  }
  if(currentPage <  1){
    currentPage = 1
  }

  // Generate page numbers
  const pages = Array?.from(Array(totalPages), (_, index) => index + 1);

  return totalPages > 1 ? (
    <div className={styles.pagination}>
      
        {(totalPages > 5 && currentPage > 1) && ( <a className={styles.dots} onClick={() => handlePageChange(currentPage-1)}  >&lt;</a>)}
        <>
            {currentPage > 2 && ( <a className={styles.dots} onClick={() => handlePageChange(1)}>{1}</a>)}
            {currentPage > 3 && (<a className={styles.dots}>...</a>)}
        </>
        {pages.map((page) => {
          if (
            page === currentPage ||
            page === currentPage - 1 ||
            page === currentPage + 1 
          ) {
            return  page === currentPage ?
              ( <a className={currentPage === page ? `${styles.active}`: ""} >{page}</a>)
            :
              ( <a className={currentPage === page ? `${styles.active}`: ""} onClick={() => handlePageChange(page)}>{page}</a>)
            }
          return null;
        })}
        <>
            {currentPage < (totalPages - 2) &&
              (<a className={styles.dots}>...</a>)
            }
            {currentPage < (totalPages -1) &&
              (<a className={styles.dots} onClick={() => handlePageChange(totalPages)}>{totalPages}</a>)
            }
        </>
        {(totalPages > 5 && currentPage < totalPages) && (<a className={styles.dots} onClick={() => handlePageChange(currentPage+1)}>&gt;</a>)}
      
    </div>
  ) : (<></>)
};

export default Pagination;
