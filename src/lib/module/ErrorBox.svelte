<script>
    export let message = "This is an error message!";
    export let duration = 3000;

    let show = false;

    function showError() {
        show = true;
        setTimeout(() => {
            show = false;
        }, duration);
    }

    setTimeout(showError, 0);
</script>

<style>
    .error-box {
        display: none;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f8d7da;
        color: #721c24;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: dropDown 0.5s ease-out forwards;
        width: 50rem;
    }

    .error-box.show {
        display: block;
    }

    @keyframes dropDown {
        0% {
            top: -100px;
            opacity: 0;
        }
        100% {
            top: 20px;
            opacity: 1;
        }
    }
</style>

<div class="error-box {show ? 'show' : ''}">
    {message}
</div>