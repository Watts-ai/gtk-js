use gtk::prelude::*;
use relm4::prelude::*;

pub struct ProgressbarOsdHorizontal;

#[relm4::component(pub)]
impl SimpleComponent for ProgressbarOsdHorizontal {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ProgressBar {
            set_fraction: 0.4,
            add_css_class: "osd",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
