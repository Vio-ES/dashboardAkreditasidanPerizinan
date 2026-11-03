interface PageButtonProps {
    pageNum: number;
    isActive: boolean;
    onClick: () => void;
}

export function PageButton({ pageNum, isActive, onClick } : PageButtonProps){
    return(
        <button onClick={onClick} className={`join-item btn btn-xs ${isActive ? "btn-active" : ""}`}>
            {pageNum}
        </button>
    )
}
