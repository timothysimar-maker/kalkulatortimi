
        //  Bagian ini akan dijalankan setelah semua elemen HTML dimuat
        document.addEventListener('DOMContentLoaded', function() {
            
            //  Menangkap elemen penting dari kalkulator
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('.btn-calc');

            //  Menampilkan status ketika normal, sukses, dan error 
            const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=KALKULATOR';
            const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Yeay!+Berhasil+:)';
            const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Ups...+Ada+yang+salah,+nih+:(';

            /**
              Mengganti gambar status kalkulator 
             */
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                    statusImage.alt = "Perhitungan Sukses";
                } else if (state === 'error') {
                    statusImage.src = imgError;
                    statusImage.alt = "Error Perhitungan";
                } else {
                    //  Balik ke gambar normal 
                    statusImage.src = imgNormal;
                    statusImage.alt = "Status Kalkulator";
                }
            }

            /**
              Menghapus semua isi di layar kalkulator 
             */
            function clearDisplay() {
                display.value = '';
                changeImage('normal'); // Memanggil function untuk merubah gambar
            }

            /**
              Menghapus satu karakter terakhir
             */
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            /**
              Menjumlahkan angka/operator di layar kalkulator
             */
            function appendToDisplay(value) {
                display.value += value;
            }

            /**
              Menghitung hasil pengoperasian di layar
             */
            function calculateResult() {
                // Kalau layar kosong, tampilkan error
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Kosong!';
                    // Hapus otomatis setelah 1,5 detik
                    setTimeout(clearDisplay, 1500);
                    return;
                }

                try {
                    //  Proses perhitungan persen
                    let result = eval(display.value
                        .replace(/%/g, '/100') // Mengganti % jadi /100 biar bisa dihitung 
                    ); 
                    
                    //  Kalau hasilnya masih angka yang valid, tampilkan hasil 
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); // Mengubah gambar jadi Yeay! Berhasil :)
                    } else {
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error'); //  Mengubah gambar jadi Ups... ada yang salah nih :(
                    setTimeout(clearDisplay, 5000);
                }
            }


            //  Menambahkan event ke semua tombol kalkulator
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.getAttribute('data-value');

                    //  Mengecek tombol mana yang diklik dan dijalankan fungsinya 
                    switch(value) {
                        case 'C':
                            //  tombol clear
                            clearDisplay();
                            break;
                        case 'DEL':
                            //  tombol hapus per satu karakter
                            deleteLastChar();
                            break;
                        case '=':
                            //  tombol sama dengan 
                            calculateResult();
                            break;
                        default:
                            //  kalau baru selesai sukses/error, hapus layar lebih dulu
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                clearDisplay();
                            }
                            appendToDisplay(value);
                            break;
                    }
                });
            });

            //  Event keyboard agar bisa dikontrol pakai keyboard juga 
            document.addEventListener('keydown', (e) => {
                const key = e.key;

                if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key);
                    e.preventDefault();
                } else if (key === 'Enter' || key === '=') {
                    calculateResult();
                    e.preventDefault();
                } else if (key === 'Backspace') {
                    deleteLastChar();
                    e.preventDefault();
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay();
                    e.preventDefault();
                }
            });

        });
  