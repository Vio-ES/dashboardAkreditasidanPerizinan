import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageButton } from "./PageButton";

interface PaginationProps{
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    totalData: number;
}

export function Pagination({page, pageSize, setPage, totalData} : PaginationProps){
    const totalPages = Math.ceil(totalData / pageSize);
    const start = Math.max(2, page-1);
    const end = Math.min(page+1, totalPages - 1);
    const middlePages = Array.from({ length: end - start + 1}, (_, index) => index + start);
    const from = pageSize * page - pageSize + 1; 
    const to = Math.min(totalData, from + pageSize - 1);


    return(
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <div>Menampilkan {totalData ? from + "-" + to  : 0} dari {totalData ?? 0}</div>
          <div className="join">
              {totalPages <= 3 && 
                Array.from({ length: totalPages}, (_, index) => index + 1)
                  .map((pageNum) => (
                    <PageButton
                      key={pageNum}
                      pageNum={pageNum}
                      isActive={pageNum === page}
                      onClick={() => setPage(pageNum)}
                    />
                  ))
              }
              {totalPages > 3 && 
                <div className="flex items-center justify-between px-4 py-2 gap-4 text-sm">
                  <button onClick={() => setPage(page -  1)} disabled={page <= 1} className={`join-item btn btn-xs ${page <= 1 ? "hidden" : ""}`}><ChevronLeft/></button>
                  <PageButton
                      pageNum={1}
                      isActive={page === 1}
                      onClick={() => setPage(1)}
                  />
                  <button className={`join-item btn btn-xs ${start === 2 ? "hidden" : "btn-disabled"}`}>...</button>
                  {middlePages.map((pageNum) => (
                    <PageButton
                        key={pageNum}
                        pageNum={pageNum}
                        isActive={pageNum === page}
                        onClick={() => setPage(pageNum)}
                    />
                  ))}
                  <button className={`join-item btn btn-xs ${end === totalPages-1 ? "hidden" : "btn-disabled"}`}>...</button>
                  <PageButton
                      pageNum={totalPages}
                      isActive={page === totalPages}
                      onClick={() => setPage(totalPages)}
                  />
                  <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className={`join-item btn btn-xs ${page >= totalPages ? "hidden" : ""}`}><ChevronRight/></button>
                </div>
              }
          </div>
        </div>
    )
}
