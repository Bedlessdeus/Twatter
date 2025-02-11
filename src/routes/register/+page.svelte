<script lang="ts">
    let username = '';
    let password = '';
    let confirmPassword = '';
    const HANDLESUBMIT = () => {

    }

    const isTaken = async () => {
        let fe = await fetch(`/api/v1/user/check?USERNAME=${username}`)
        let failed = (await fe.json()).used;
        console.log(failed);
    }

    if(document != undefined) {
        let form = document.querySelector("form");
        if(form != undefined) {
            form.onchange = () => {
                if(password != confirmPassword) {

                }
                isTaken()
            }
        }
    }
  </script>

  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>

      <form id="register" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="Username"
            bind:value={username}
            placeholder="Bedlessdeus"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          />
        </div>
  
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            placeholder="********"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          />
        </div>
  
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            bind:value={confirmPassword}
            placeholder="********"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          />
        </div>
  
        <div>
          <button
            type="submit"
            onclick={HANDLESUBMIT}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            Register
          </button>
        </div>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        Already have an account?
        <a href="/login" class="text-blue-600 hover:underline">Login here</a>.
      </p>
    </div>
  </div>  